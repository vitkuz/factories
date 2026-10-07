export interface FileSystemClient {
  readText: (file: string) => string;
  exists: (target: string) => boolean;
  /** Direct child directory names, sorted. */
  listDirectories: (directory: string) => string[];
  /** The files a glob matches, or undefined when this Node cannot expand globs (fs.globSync is Node 22+). */
  glob: (pattern: string) => string[] | undefined;
}
