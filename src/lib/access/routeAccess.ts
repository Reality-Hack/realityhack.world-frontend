import { Capability } from './capabilities';
import { matchesPrefix, resolveRoutePolicy } from './routePolicies';

export const FALLBACK_ROUTE = '/';
export const SIGN_IN_ROUTE = '/signin';

/** Reachable without a session; a signed-in user is bounced off them. */
export const PUBLIC_ROUTES = ['/apply', '/signin', '/rsvp', '/signout'] as const;

export type RouteAccessStatus = 'pending' | 'allowed' | 'denied';

export interface RouteAccessResult {
  status: RouteAccessStatus;
  /** Where to send the user; null when nothing needs to happen. */
  redirectTo: string | null;
  /** Human-readable denial cause, for logging. */
  reason?: string;
}

export interface RouteAccessInput {
  path: string;
  hasSession: boolean;
  isAuthLoading: boolean;
  capabilities: ReadonlySet<Capability>;
}

export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => matchesPrefix(path, route));
}

const ALLOWED: RouteAccessResult = { status: 'allowed', redirectTo: null };

export function evaluateRouteAccess({
  path,
  hasSession,
  isAuthLoading,
  capabilities,
}: RouteAccessInput): RouteAccessResult {
  if (isAuthLoading) return { status: 'pending', redirectTo: null };

  const isPublic = isPublicRoute(path);

  if (hasSession && isPublic) {
    return deny(path, FALLBACK_ROUTE, 'signed in on a public-only route');
  }
  if (!hasSession) {
    return isPublic ? ALLOWED : deny(path, SIGN_IN_ROUTE, 'no session');
  }

  const policy = resolveRoutePolicy(path);
  if (!policy) {
    return deny(path, FALLBACK_ROUTE, 'no route policy covers this path');
  }
  if (!capabilities.has(policy.capability)) {
    return deny(path, FALLBACK_ROUTE, `missing capability ${policy.capability}`);
  }
  return ALLOWED;
}

/**
 * A denial that would redirect to the page we are already on has nowhere to
 * go — a user with no capability for the fallback route would otherwise sit on
 * a blank screen. Let it through instead; the fallback route is always
 * reachable by design.
 */
function deny(path: string, redirectTo: string, reason: string): RouteAccessResult {
  if (redirectTo === path) return ALLOWED;
  return { status: 'denied', redirectTo, reason };
}
