import type { FileSystemClient } from '../../../clients/file-system/index.js';
import type { State } from '../state.types.js';
import { serializeState, statePathFor } from '../state.utils.js';

/** Write the run's state.json in its written form, atomically (temp file + rename). */
export const writeStateFactory =
  (fileSystem: FileSystemClient) =>
  (runDir: string, state: State): void =>
    fileSystem.writeTextAtomic(statePathFor(runDir), serializeState(state));
