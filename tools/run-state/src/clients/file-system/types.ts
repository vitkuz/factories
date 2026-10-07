export interface FileSystemClient {
  readText: (file: string) => string;
  exists: (target: string) => boolean;
  /** Direct child directory names, sorted. */
  listDirectories: (directory: string) => string[];
  /** Create the folder and its parents; nothing happens when it exists. */
  makeDirectory: (directory: string) => void;
  /** Write to a temp file beside the target, then rename it over: a reader never sees half a file. */
  writeTextAtomic: (file: string, text: string) => void;
}
