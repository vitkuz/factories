import { CliArgs } from './record-processing.types';

export const USAGE = `record-processing --uuid <quoteUuid> --run-dir <run folder> [--skill <id>] [--skip-log] [--skip-meta] [--dry-run]`;

const VALUE_FLAGS: Record<string, keyof Pick<CliArgs, 'uuid' | 'runDir' | 'skill'>> = {
  '--uuid': 'uuid',
  '--run-dir': 'runDir',
  '--skill': 'skill',
};

const BOOLEAN_FLAGS: Record<string, keyof Pick<CliArgs, 'skipLog' | 'skipMeta' | 'dryRun' | 'help'>> = {
  '--skip-log': 'skipLog',
  '--skip-meta': 'skipMeta',
  '--dry-run': 'dryRun',
  '--help': 'help',
  '-h': 'help',
};

interface Parsed {
  values: Partial<Record<'uuid' | 'runDir' | 'skill', string>>;
  flags: Partial<Record<'skipLog' | 'skipMeta' | 'dryRun' | 'help', boolean>>;
}

const step = (argv: string[], index: number, acc: Parsed): Parsed => {
  if (index >= argv.length) {
    return acc;
  }
  const token: string = argv[index];
  const [name, inline]: string[] =
    token.startsWith('--') && token.includes('=') ? [token.slice(0, token.indexOf('=')), token.slice(token.indexOf('=') + 1)] : [token];
  if (name in VALUE_FLAGS) {
    const value: string | undefined = inline ?? argv[index + 1];
    if (value === undefined || (inline === undefined && value.startsWith('--'))) {
      throw new Error(`${name} needs a value`);
    }
    return step(argv, inline === undefined ? index + 2 : index + 1, { ...acc, values: { ...acc.values, [VALUE_FLAGS[name]]: value } });
  }
  if (name in BOOLEAN_FLAGS) {
    return step(argv, index + 1, { ...acc, flags: { ...acc.flags, [BOOLEAN_FLAGS[name]]: true } });
  }
  throw new Error(`unknown argument: ${token}`);
};

// argv without `node` and the script. Throws on an unknown flag or a missing value; required values are checked by
// the caller (so `--help` works alone).
export const parseArgs = (argv: string[]): CliArgs => {
  const parsed: Parsed = step(argv, 0, { values: {}, flags: {} });
  return {
    uuid: parsed.values.uuid ?? '',
    runDir: parsed.values.runDir ?? '',
    ...(parsed.values.skill === undefined ? {} : { skill: parsed.values.skill }),
    skipLog: parsed.flags.skipLog ?? false,
    skipMeta: parsed.flags.skipMeta ?? false,
    dryRun: parsed.flags.dryRun ?? false,
    help: parsed.flags.help ?? false,
  };
};
