import winston from 'winston';

// JSON lines on stderr only: stdout is reserved for the result JSON.
const ALL_LEVELS: string[] = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

export const logger: winston.Logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console({ stderrLevels: ALL_LEVELS })],
});

export const setLogLevel = (level: string): void => {
  logger.level = level;
};
