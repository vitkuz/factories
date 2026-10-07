import { createLogger, format, transports, type Logger } from 'winston';
import env from '../config/env.js';

const LEVELS: string[] = ['error', 'warn', 'info', 'debug'];

const line = format.printf(({ timestamp, level, message, ...context }): string => {
  const tail = Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : '';
  return `${String(timestamp)} ${level.toUpperCase().padEnd(5)} ${String(message)}${tail}`;
});

/**
 * Everything goes to stderr: stdout belongs to the command's result (`--json` prints the report there),
 * so a pipe into `jq` never meets a log line.
 */
export const logger: Logger = createLogger({
  level: env.LOG_LEVEL,
  format: format.combine(format.timestamp({ format: 'HH:mm:ss' }), line),
  transports: [new transports.Console({ stderrLevels: LEVELS })],
});
