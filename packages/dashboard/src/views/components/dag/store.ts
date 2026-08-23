import type { Job } from '#src/views/components/dag/dag';

// #state
export const hover: { id: string | null } = { id: null };

// #state
export const dag: { jobs: Job[] } = {
    jobs: [
        { id: 'checkout' },
        { id: 'config' },
        { id: 'secrets' },
        { id: 'install', dependsOn: ['checkout'] },
        { id: 'restore-cache', dependsOn: ['checkout'] },
        { id: 'lint', dependsOn: ['install'] },
        { id: 'typecheck', dependsOn: ['install'] },
        { id: 'unit', dependsOn: ['install', 'restore-cache'] },
        { id: 'build-api', dependsOn: ['install', 'config'] },
        { id: 'build-web', dependsOn: ['install', 'config'] },
        { id: 'build-worker', dependsOn: ['install'] },
        { id: 'integration', dependsOn: ['build-api', 'build-web'] },
        { id: 'e2e', dependsOn: ['build-web', 'build-worker'] },
        { id: 'contract', dependsOn: ['build-api'] },
        {
            id: 'security-scan',
            dependsOn: ['build-api', 'build-web', 'build-worker'],
        },
        { id: 'package-api', dependsOn: ['build-api', 'unit'] },
        { id: 'package-web', dependsOn: ['build-web', 'unit'] },
        {
            id: 'docker',
            dependsOn: ['package-api', 'package-web', 'build-worker'],
        },
        { id: 'sign', dependsOn: ['docker', 'secrets'] },
        { id: 'staging', dependsOn: ['sign', 'integration', 'e2e'] },
        { id: 'smoke', dependsOn: ['staging'] },
        { id: 'perf', dependsOn: ['staging'] },
        {
            id: 'approve',
            dependsOn: ['smoke', 'perf', 'contract', 'security-scan'],
        },
        { id: 'rollback-plan', dependsOn: ['approve'] },
        { id: 'prod', dependsOn: ['approve', 'sign'] },
        { id: 'metrics', dependsOn: ['prod', 'perf'] },
        { id: 'notify', dependsOn: ['prod', 'rollback-plan'] },
    ],
};
