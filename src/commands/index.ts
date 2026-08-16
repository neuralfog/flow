import type { Command } from './command';
import { migrate } from './migrate';
import { reconcile } from './reconcile';
import { workers } from './workers';

export const commands: Command[] = [migrate, reconcile, workers];
