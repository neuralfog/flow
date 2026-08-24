import { Status } from '#src/views/types/Status';

const STATUS_TEXT: Record<Status, string> = {
    [Status.Waiting]: 'Waiting',
    [Status.Scheduled]: 'Scheduled',
    [Status.Running]: 'Running',
    [Status.Completed]: 'Completed',
    [Status.Failed]: 'Failed',
    [Status.TimedOut]: 'Timed out',
};

export const statusText = (status: Status): string => STATUS_TEXT[status];
