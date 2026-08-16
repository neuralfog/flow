import { migrate } from './migrate';
import { reconcile } from './reconcile';
import { workers } from './workers';
export const commands = [migrate, reconcile, workers];
