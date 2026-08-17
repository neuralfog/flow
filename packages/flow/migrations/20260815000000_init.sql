create schema if not exists flow;

do $$ begin
    create type flow.job_state as enum ('scheduled', 'running', 'completed', 'failed', 'timed_out');
exception when duplicate_object then null; end $$;

do $$ begin
    create type flow.worker_state as enum ('running', 'paused', 'draining');
exception when duplicate_object then null; end $$;

create table if not exists flow.jobs (
    id           uuid primary key default gen_random_uuid(),
    kind         text not null,
    args         text not null,
    state        flow.job_state not null default 'scheduled',
    execute_at   timestamptz not null default now(),
    repeat_every interval,
    retryable    boolean not null default false,
    attempt      int not null default 0,
    max_attempts int not null default 1,
    backoff      interval not null default interval '0',
    timeout      int not null default 60000,
    created_at   timestamptz not null default now(),
    executed_at  timestamptz,
    completed_at timestamptz,
    worker_id    uuid,
    worker_boot_id uuid,
    last_error   text
);

create index if not exists jobs_claim on flow.jobs (execute_at) where state = 'scheduled';

create unique index if not exists jobs_recurring on flow.jobs (kind)
    where state = 'scheduled' and repeat_every is not null;

create index if not exists jobs_running on flow.jobs (worker_boot_id)
    where state = 'running';

create table if not exists flow.workers (
    id            uuid primary key default gen_random_uuid(),
    worker_id     text not null unique,
    boot_id       uuid,
    desired_state flow.worker_state not null default 'running',
    current_job   uuid,
    jobs_done     bigint not null default 0,
    started_at    timestamptz not null default now()
);

alter table flow.jobs
    add constraint jobs_worker_fk
    foreign key (worker_id) references flow.workers (id) on delete set null;

create or replace function flow.notify() returns trigger language plpgsql as $$
begin
    perform pg_notify('flow', '');
    return null;
end;
$$;

drop trigger if exists jobs_notify on flow.jobs;
create trigger jobs_notify
    after insert or update on flow.jobs
    for each row when (new.state = 'scheduled')
    execute function flow.notify();

create or replace function flow.seed_next() returns trigger language plpgsql as $$
begin
    insert into flow.jobs (
        kind, args, execute_at, repeat_every, retryable, max_attempts, backoff, timeout
    )
    values (
        new.kind,
        new.args,
        new.execute_at + new.repeat_every,
        new.repeat_every,
        new.retryable,
        new.max_attempts,
        new.backoff,
        new.timeout
    )
    on conflict (kind) where state = 'scheduled' and repeat_every is not null
    do nothing;
    return null;
end;
$$;

drop trigger if exists jobs_seed_next on flow.jobs;
create trigger jobs_seed_next
    after update on flow.jobs
    for each row
    when (old.state = 'scheduled' and new.state = 'running' and new.repeat_every is not null)
    execute function flow.seed_next();

create or replace function flow.reconcile()
returns bigint language sql as $$
    with u as (
        update flow.jobs
        set state = 'failed', last_error = 'worker died mid-job'
        where state = 'running'
          and not exists (
              select 1 from pg_stat_activity a
              where a.application_name like '%:' || worker_boot_id::text
          )
        returning 1
    )
    select count(*) from u;
$$;

create or replace function flow.fail_dead() returns trigger language plpgsql as $$
begin
    perform flow.reconcile();
    return null;
end;
$$;

drop trigger if exists workers_boot_changed on flow.workers;
create trigger workers_boot_changed
    after update on flow.workers
    for each row when (old.boot_id is distinct from new.boot_id)
    execute function flow.fail_dead();

drop trigger if exists workers_desired_changed on flow.workers;
create trigger workers_desired_changed
    after update on flow.workers
    for each row when (old.desired_state is distinct from new.desired_state)
    execute function flow.notify();

create or replace function flow.enqueue(
    p_kind text, p_args text, p_run_at timestamptz,
    p_retryable boolean, p_attempts int, p_backoff int, p_timeout int
) returns uuid language sql as $$
    insert into flow.jobs (kind, args, state, execute_at, retryable, max_attempts, backoff, timeout)
    values (
        p_kind, p_args, 'scheduled', p_run_at,
        p_retryable, p_attempts, p_backoff * interval '1 millisecond',
        coalesce(p_timeout, 60000)
    )
    returning id;
$$;

create or replace function flow.schedule(
    p_kind text, p_args text, p_run_at timestamptz, p_every int,
    p_retryable boolean, p_attempts int, p_backoff int, p_timeout int
) returns void language sql as $$
    insert into flow.jobs (
        kind, args, state, execute_at, repeat_every, retryable, max_attempts, backoff, timeout
    )
    values (
        p_kind, p_args, 'scheduled', p_run_at, make_interval(secs => p_every),
        p_retryable, p_attempts, p_backoff * interval '1 millisecond',
        coalesce(p_timeout, 60000)
    )
    on conflict (kind) where state = 'scheduled' and repeat_every is not null
    do update set args = excluded.args, repeat_every = excluded.repeat_every,
                  retryable = excluded.retryable, max_attempts = excluded.max_attempts,
                  backoff = excluded.backoff, timeout = excluded.timeout;
$$;

create or replace function flow.claim(p_worker uuid, p_boot uuid)
returns table (id uuid, kind text, args text, attempt int, timeout int)
language sql as $$
    update flow.jobs as j2
    set state = 'running',
        executed_at = now(),
        attempt = j2.attempt + 1,
        worker_id = p_worker,
        worker_boot_id = p_boot
    where j2.id = (
        select j.id from flow.jobs j
        where j.state = 'scheduled' and j.execute_at <= now()
        order by j.execute_at
        for update skip locked
        limit 1
    )
    returning j2.id, j2.kind, j2.args, j2.attempt, j2.timeout;
$$;

create or replace function flow.complete(p_job uuid, p_worker_id text)
returns void language sql as $$
    update flow.jobs set state = 'completed', completed_at = now() where id = p_job;
    update flow.workers set jobs_done = jobs_done + 1 where worker_id = p_worker_id;
$$;

create or replace function flow.fail(p_job uuid, p_message text, p_terminal text default 'failed')
returns void language sql as $$
    update flow.jobs
    set state = (case
            when retryable and attempt < max_attempts
            then 'scheduled' else p_terminal end)::flow.job_state,
        execute_at = case
            when retryable and attempt < max_attempts
            then now() + backoff else execute_at end,
        repeat_every = case
            when retryable and attempt < max_attempts
            then null else repeat_every end,
        last_error = p_message
    where id = p_job;
$$;

create or replace function flow.next_run()
returns timestamptz language sql stable as $$
    select min(execute_at) from flow.jobs where state = 'scheduled';
$$;

create or replace function flow.register(p_worker_id text, p_boot uuid)
returns uuid language sql as $$
    insert into flow.workers (worker_id, boot_id, started_at)
    values (p_worker_id, p_boot, now())
    on conflict (worker_id) do update set boot_id = p_boot, started_at = now()
    returning id;
$$;

create or replace function flow.busy(p_worker_id text, p_job uuid)
returns void language sql as $$
    update flow.workers set current_job = p_job where worker_id = p_worker_id;
$$;

create or replace function flow.idle(p_worker_id text)
returns void language sql as $$
    update flow.workers set current_job = null where worker_id = p_worker_id;
$$;

create or replace function flow.desired_state(p_worker_id text)
returns flow.worker_state language sql stable as $$
    select desired_state from flow.workers where worker_id = p_worker_id;
$$;

create or replace function flow.list_workers()
returns table (
    worker_id text, desired_state flow.worker_state,
    current_job uuid, jobs_done bigint, started_at timestamptz, alive boolean
) language sql stable as $$
    select w.worker_id, w.desired_state, w.current_job, w.jobs_done,
           w.started_at,
           exists (
               select 1 from pg_stat_activity a
               where a.application_name like 'flow:worker:' || w.worker_id || ':%'
           )
    from flow.workers w
    order by w.worker_id;
$$;

create or replace function flow.pending()
returns table (id uuid, kind text, execute_at timestamptz, attempt int)
language sql stable as $$
    select j.id, j.kind, j.execute_at, j.attempt
    from flow.jobs j
    where j.state = 'scheduled'
    order by j.execute_at;
$$;

create or replace function flow.failed()
returns table (id uuid, kind text, last_error text, attempt int)
language sql stable as $$
    select j.id, j.kind, j.last_error, j.attempt
    from flow.jobs j
    where j.state = 'failed'
    order by j.id;
$$;
