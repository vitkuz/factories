import type { RunContext } from '../commands/commands.types.js';
import { routeOf } from '../commands/commands.utils.js';
import type { RouteFailureReason, RouteResult } from '../routing/index.js';

/**
 * A routing guard's check: resolve the edge (resolve-edge.utils.ts is the one place that knows how)
 * and refuse only when it fails for this guard's reason. So each way routing can fail is its own
 * named guard, and the routing rules are written once.
 */
export const routeFailure =
  (reason: RouteFailureReason) =>
  (context: RunContext): string | undefined => {
    const route: RouteResult = routeOf(context);
    return !route.ok && route.reason === reason ? route.error : undefined;
  };
