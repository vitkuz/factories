import type { z } from 'zod';
import type { FileSystemClient } from '../../../clients/file-system/index.js';
import type { Result } from '../../../shared/types/result.types.js';
import { errorMessage } from '../../../shared/utils/error.utils.js';
import { ok, refuse } from '../../../shared/utils/result.utils.js';
import { stateSchema } from '../state.schema.js';
import type { State } from '../state.types.js';
import { statePathFor } from '../state.utils.js';

export const STATE_CHECKS = {
  exists: {
    id: 'state-file-exists',
    description: 'The run folder holds a state.json (open the run first).',
  },
  valid: {
    id: 'state-file-valid',
    description: 'state.json is JSON that matches the state Zod shape (state.schema.json).',
  },
} as const;

const issueLine = (issue: z.core.$ZodIssue): string =>
  `${['state', ...issue.path.map(String)].join('.')}: ${issue.message}`;

/**
 * The run's state.json, checked against the Zod shape. The document is returned as read, not as Zod
 * rebuilt it, so nested key order (context, pause, details) survives a rewrite untouched.
 */
export const readStateFactory =
  (fileSystem: FileSystemClient) =>
  (runDir: string): Result<State> => {
    const file: string = statePathFor(runDir);
    if (!fileSystem.exists(file)) {
      return refuse(STATE_CHECKS.exists.id)(`no state.json in ${runDir}: open the run first`);
    }
    const document: unknown | Error = ((): unknown => {
      try {
        return JSON.parse(fileSystem.readText(file)) as unknown;
      } catch (error: unknown) {
        return new Error(errorMessage(error));
      }
    })();
    if (document instanceof Error) {
      return refuse(STATE_CHECKS.valid.id)(`${file} is not valid JSON: ${document.message}`);
    }
    const parsed = stateSchema.safeParse(document);
    return parsed.success
      ? ok(document as State)
      : refuse(STATE_CHECKS.valid.id)(
          `${file} does not match the state schema: ${parsed.error.issues.map(issueLine).join('; ')}`,
        );
  };
