import { CliArgs } from './pick-quote.types';

export const USAGE = `pick-quote [--url <console search URL>] [--max <n>]`;

const VALUE_FLAGS: Record<string, keyof Pick<CliArgs, 'url' | 'max'>> = {
  '--url': 'url',
  '--max': 'max',
};

const BOOLEAN_FLAGS: Record<string, keyof Pick<CliArgs, 'help'>> = {
  '--help': 'help',
  '-h': 'help',
};

interface Parsed {
  values: Partial<Record<'url' | 'max', string>>;
  flags: Partial<Record<'help', boolean>>;
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

// argv without `node` and the script. Throws on an unknown flag or a missing value. `--url=<url>` keeps every `=` of
// the URL after the first one.
export const parseArgs = (argv: string[]): CliArgs => {
  const parsed: Parsed = step(argv, 0, { values: {}, flags: {} });
  return {
    ...(parsed.values.url === undefined ? {} : { url: parsed.values.url }),
    ...(parsed.values.max === undefined ? {} : { max: parsed.values.max }),
    help: parsed.flags.help ?? false,
  };
};
