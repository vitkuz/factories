import winston from 'winston';

const ALL_LEVELS: string[] = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

// JSON lines on stderr only: stdout is reserved for the result JSON.
export const createLogger = (level: string): winston.Logger =>
  winston.createLogger({
    level,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.Console({ stderrLevels: ALL_LEVELS })],
  });
