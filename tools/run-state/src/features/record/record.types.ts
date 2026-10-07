import type { Clock, RunIdGenerator } from '../../clients/clock/index.js';
import type { FileSystemClient } from '../../clients/file-system/index.js';

/** Everything the recorder touches outside its pure commands, injected. */
export interface RecordDeps {
  fileSystem: FileSystemClient;
  /** A clock whose first reading is later than `after` (the run's last recorded timestamp). */
  clockAfter: (after?: string) => Clock;
  newRunId: RunIdGenerator;
  /** The project root: factories.local/<id> and factories/<id> pipelines and repo-relative paths start here. */
  rootPath: string;
  /** Where relative paths on the command line start. */
  cwd: string;
  /** CLAUDE_SESSION_ID, or ''. */
  sessionId: string;
  /** Absolute path of state.schema.json: the `$schema` a new state.json points at. */
  schemaFile: string;
}
