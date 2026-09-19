/**
 * Capabilities are the single vocabulary for "what may this user reach".
 *
 * Keycloak client roles (year-scoped — see auth/token-utils) and build-time
 * feature flags collapse into a capability set exactly once, in AuthContext.
 * Navigation, route guarding and in-page gating all read that set, so the
 * sidebar can never disagree with the guard.
 */
import type { FeatureFlags } from './featureFlags';

export const CAPABILITIES = [
  'home.view',
  'schedule.view',
  'showcase.view',
  'tracks.view',
  'resources.view',
  'guide.view',
  'settings.view',
  'sponsor.view',
  'mentors.view',
  'lighthouses.view',
  'workshops.view',
  'teamFormation.view',
  'team.view',
  'help.view',
  'hardware.view',
  'admin.dashboard',
  'admin.checkin',
  'admin.teams',
  'admin.hardware',
  'admin.applications',
  'admin.rsvp',
  'admin.users',
  'admin.markdown',
  'admin.events',
  'admin.workshops',
  'admin.sponsors',
] as const;

export type Capability = (typeof CAPABILITIES)[number];

/**
 * The role predicates this derivation needs. AuthContextType extends it, so
 * widening the contract is a compile error at the context rather than drift.
 */
export interface RoleFlags {
  isAdmin: boolean;
  isVolunteer: boolean;
  isOrganizer: boolean;
  canAccessSponsor: boolean;
  canAccessMentor: boolean;
  canAccessParticipant: boolean;
}

export function deriveCapabilities(
  roles: RoleFlags,
  flags: FeatureFlags,
): ReadonlySet<Capability> {
  const capabilities = new Set<Capability>();
  const grant = (enabled: boolean, ...granted: Capability[]) => {
    if (enabled) granted.forEach((capability) => capabilities.add(capability));
  };

  const {
    isAdmin,
    isVolunteer,
    isOrganizer,
    canAccessSponsor,
    canAccessMentor,
    canAccessParticipant,
  } = roles;

  grant(flags.home, 'home.view');
  grant(flags.schedule, 'schedule.view');
  grant(flags.showcase, 'showcase.view');
  grant(flags.tracks, 'tracks.view');
  grant(flags.resources, 'resources.view');
  grant(flags.eventGuide, 'guide.view');
  grant(flags.settings, 'settings.view');

  grant(flags.sponsorDashboard && canAccessSponsor, 'sponsor.view');
  grant(flags.mentorHelp && canAccessMentor, 'mentors.view');
  grant(flags.lighthouses && canAccessMentor, 'lighthouses.view');
  grant(flags.workshops && (canAccessMentor || canAccessParticipant), 'workshops.view');
  grant(flags.hackersMet && canAccessParticipant, 'teamFormation.view');
  grant(flags.teams && canAccessParticipant, 'team.view');
  grant(flags.hackerHelp && canAccessParticipant, 'help.view');
  grant(flags.hardwareCheckout && canAccessParticipant, 'hardware.view');

  // Volunteers and organizers keep the dashboard plus the three tiles
  // admin/page.tsx has always shown them; everything else under /admin is
  // admin-only. Narrower Keycloak roles (admin-applications:<year>, …) slot in
  // here without touching ROUTE_POLICIES or the nav.
  const isStaff = flags.admin && (isAdmin || isVolunteer || isOrganizer);
  grant(isStaff, 'admin.dashboard', 'admin.checkin', 'admin.teams', 'admin.hardware');

  const isFullAdmin = flags.admin && isAdmin;
  grant(isFullAdmin, 'admin.applications', 'admin.rsvp', 'admin.users', 'admin.markdown');
  grant(isFullAdmin && flags.events, 'admin.events');
  grant(isFullAdmin && flags.workshops, 'admin.workshops');
  grant(isFullAdmin && flags.sponsorAdmin, 'admin.sponsors');

  return capabilities;
}
