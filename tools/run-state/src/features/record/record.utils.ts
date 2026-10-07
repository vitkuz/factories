import type { GuardMeta } from '../guards/guards.types.js';
import { PIPELINE_CHECKS } from '../pipeline/services/load-pipeline.service.js';
import { STATE_CHECKS } from '../state/services/read-state.service.js';
import type { AnyCommand } from '../commands/commands.types.js';

/** open's own load checks, before the pipeline ones. */
export const OPEN_CHECKS = {
  notOpen: {
    id: 'run-not-open',
    description: 'The run folder holds no state.json yet: a run is opened once.',
  },
  found: {
    id: 'pipeline-found',
    description:
      'The pipeline is an id under factories.local/ or factories/, or a path to a pipeline.json.',
  },
} as const;

/**
 * The refusals that come from reading files, in the order a command meets them: after its
 * argument guards, before its own guards.
 */
export const loadChecksOf = (kind: AnyCommand['kind']): GuardMeta[] => {
  if (kind === 'open') {
    return [OPEN_CHECKS.notOpen, OPEN_CHECKS.found, PIPELINE_CHECKS.exists, PIPELINE_CHECKS.valid];
  }
  const state: GuardMeta[] = [STATE_CHECKS.exists, STATE_CHECKS.valid];
  return kind === 'show' ? state : [...state, PIPELINE_CHECKS.exists, PIPELINE_CHECKS.valid];
};
