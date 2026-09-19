import { Capability } from './capabilities';

/**
 * The route → capability table is the single source of truth for
 * reachability. A path with no matching policy is denied (see
 * evaluateRouteAccess), so adding a route without a policy fails closed.
 */
export interface RoutePolicy {
  /** Guards this path and everything below it, matched on segment boundaries. */
  prefix: string;
  capability: Capability;
}

export const ROUTE_POLICIES: readonly RoutePolicy[] = [
  { prefix: '/', capability: 'home.view' },
  { prefix: '/schedule', capability: 'schedule.view' },
  { prefix: '/showcase', capability: 'showcase.view' },
  { prefix: '/tracks', capability: 'tracks.view' },
  { prefix: '/resources', capability: 'resources.view' },
  { prefix: '/guide', capability: 'guide.view' },
  { prefix: '/settings', capability: 'settings.view' },
  { prefix: '/sponsor', capability: 'sponsor.view' },
  { prefix: '/mentors', capability: 'mentors.view' },
  { prefix: '/lighthouses', capability: 'lighthouses.view' },
  { prefix: '/workshops', capability: 'workshops.view' },
  { prefix: '/team-formation', capability: 'teamFormation.view' },
  { prefix: '/team', capability: 'team.view' },
  { prefix: '/help', capability: 'help.view' },
  { prefix: '/hardware', capability: 'hardware.view' },

  { prefix: '/admin', capability: 'admin.dashboard' },
  { prefix: '/admin/checkin', capability: 'admin.checkin' },
  { prefix: '/admin/teams', capability: 'admin.teams' },
  { prefix: '/admin/hardware', capability: 'admin.hardware' },
  { prefix: '/admin/applications', capability: 'admin.applications' },
  { prefix: '/admin/rsvp', capability: 'admin.rsvp' },
  { prefix: '/admin/users', capability: 'admin.users' },
  { prefix: '/admin/markdown', capability: 'admin.markdown' },
  { prefix: '/admin/events', capability: 'admin.events' },
  { prefix: '/admin/workshops', capability: 'admin.workshops' },
  { prefix: '/admin/sponsors', capability: 'admin.sponsors' },
];

/**
 * Segment-aware prefix match. `/team` must not match `/team-formation`, which
 * a bare startsWith would happily do.
 */
export function matchesPrefix(path: string, prefix: string): boolean {
  if (prefix === '/') return path === '/';
  return path === prefix || path.startsWith(`${prefix}/`);
}

/**
 * The most specific policy covering `path`, so `/admin/rsvp/participants`
 * resolves to admin.rsvp rather than admin.dashboard. Longest-prefix wins,
 * which keeps the table order-independent.
 */
export function resolveRoutePolicy(path: string): RoutePolicy | null {
  let best: RoutePolicy | null = null;
  for (const policy of ROUTE_POLICIES) {
    if (!matchesPrefix(path, policy.prefix)) continue;
    if (!best || policy.prefix.length > best.prefix.length) best = policy;
  }
  return best;
}
