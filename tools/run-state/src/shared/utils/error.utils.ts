// Copied from tools/validation/src/shared/utils/error.utils.ts — keep the two copies in step.
export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
