import { describe, expect, it } from 'vitest';
import { Capability, RoleFlags, deriveCapabilities } from './capabilities';
import type { FeatureFlags } from './featureFlags';
import { matchesPrefix, resolveRoutePolicy } from './routePolicies';
import { evaluateRouteAccess } from './routeAccess';

const ALL_FLAGS_ON: FeatureFlags = {
  home: true,
  admin: true,
  schedule: true,
  sponsorDashboard: true,
  showcase: true,
  tracks: true,
  hardwareCheckout: true,
  teams: true,
  hackerHelp: true,
  mentorHelp: true,
  workshops: true,
  resources: true,
  eventGuide: true,
  settings: true,
  hackersMet: true,
  lighthouses: true,
  events: true,
  sponsorAdmin: true,
};

const NO_ROLES: RoleFlags = {
  isAdmin: false,
  isVolunteer: false,
  isOrganizer: false,
  canAccessSponsor: false,
  canAccessMentor: false,
  canAccessParticipant: false,
};

const roles = (overrides: Partial<RoleFlags>): RoleFlags => ({ ...NO_ROLES, ...overrides });

const accessTo = (path: string, capabilities: ReadonlySet<Capability>) =>
  evaluateRouteAccess({ path, hasSession: true, isAuthLoading: false, capabilities });

describe('matchesPrefix', () => {
  it('matches on segment boundaries only', () => {
    expect(matchesPrefix('/team', '/team')).toBe(true);
    expect(matchesPrefix('/team/roster', '/team')).toBe(true);
    expect(matchesPrefix('/team-formation/hackers-met', '/team')).toBe(false);
    expect(matchesPrefix('/administrators', '/admin')).toBe(false);
  });

  it('treats the root prefix as exact', () => {
    expect(matchesPrefix('/', '/')).toBe(true);
    expect(matchesPrefix('/schedule', '/')).toBe(false);
  });
});

describe('resolveRoutePolicy', () => {
  it('prefers the most specific policy', () => {
    expect(resolveRoutePolicy('/admin')?.capability).toBe('admin.dashboard');
    expect(resolveRoutePolicy('/admin/rsvp/participants')?.capability).toBe('admin.rsvp');
    expect(resolveRoutePolicy('/admin/events/12/prizes')?.capability).toBe('admin.events');
  });

  it('returns null for uncovered paths', () => {
    expect(resolveRoutePolicy('/nope')).toBeNull();
  });
});

describe('deriveCapabilities', () => {
  it('gives volunteers the staff subset of admin, not the whole subtree', () => {
    const capabilities = deriveCapabilities(roles({ isVolunteer: true }), ALL_FLAGS_ON);

    expect(capabilities.has('admin.dashboard')).toBe(true);
    expect(capabilities.has('admin.checkin')).toBe(true);
    expect(capabilities.has('admin.applications')).toBe(false);
    expect(capabilities.has('admin.rsvp')).toBe(false);
    expect(capabilities.has('admin.users')).toBe(false);
  });

  it('gives organizers the same staff subset', () => {
    const capabilities = deriveCapabilities(roles({ isOrganizer: true }), ALL_FLAGS_ON);

    expect(capabilities.has('admin.teams')).toBe(true);
    expect(capabilities.has('admin.applications')).toBe(false);
  });

  it('gives admins every admin capability', () => {
    const capabilities = deriveCapabilities(roles({ isAdmin: true }), ALL_FLAGS_ON);

    expect(capabilities.has('admin.applications')).toBe(true);
    expect(capabilities.has('admin.markdown')).toBe(true);
    expect(capabilities.has('admin.sponsors')).toBe(true);
  });

  it('withholds admin entirely when the admin flag is off', () => {
    const capabilities = deriveCapabilities(roles({ isAdmin: true }), {
      ...ALL_FLAGS_ON,
      admin: false,
    });

    expect(capabilities.has('admin.dashboard')).toBe(false);
    expect(capabilities.has('admin.applications')).toBe(false);
  });

  it('withholds sub-areas whose own flag is off', () => {
    const capabilities = deriveCapabilities(roles({ isAdmin: true }), {
      ...ALL_FLAGS_ON,
      events: false,
    });

    expect(capabilities.has('admin.events')).toBe(false);
    expect(capabilities.has('admin.teams')).toBe(true);
  });
});

describe('evaluateRouteAccess', () => {
  const volunteer = deriveCapabilities(roles({ isVolunteer: true }), ALL_FLAGS_ON);
  const admin = deriveCapabilities(roles({ isAdmin: true }), ALL_FLAGS_ON);
  const participant = deriveCapabilities(roles({ canAccessParticipant: true }), ALL_FLAGS_ON);

  it('lets a volunteer into check-in but not applications', () => {
    expect(accessTo('/admin/checkin', volunteer).status).toBe('allowed');
    expect(accessTo('/admin/applications/applications', volunteer)).toMatchObject({
      status: 'denied',
      redirectTo: '/',
    });
    expect(accessTo('/admin/rsvp/participants', volunteer).status).toBe('denied');
  });

  it('lets an admin into every admin subtree', () => {
    expect(accessTo('/admin/applications/invites', admin).status).toBe('allowed');
    expect(accessTo('/admin/users/judges', admin).status).toBe('allowed');
  });

  it('does not leak team-formation through the /team grant', () => {
    const teamOnly = deriveCapabilities(roles({ canAccessParticipant: true }), {
      ...ALL_FLAGS_ON,
      hackersMet: false,
    });

    expect(accessTo('/team', teamOnly).status).toBe('allowed');
    expect(accessTo('/team-formation/hackers-met', teamOnly).status).toBe('denied');
  });

  it('denies paths with no policy', () => {
    expect(accessTo('/admin/secret-report', admin).status).toBe('allowed'); // covered by /admin
    expect(accessTo('/totally-unknown', admin)).toMatchObject({ status: 'denied' });
  });

  it('sends signed-out users to sign-in and keeps public routes open', () => {
    const signedOut = {
      hasSession: false,
      isAuthLoading: false,
      capabilities: new Set<Capability>(),
    };

    expect(evaluateRouteAccess({ path: '/team', ...signedOut })).toMatchObject({
      status: 'denied',
      redirectTo: '/signin',
    });
    expect(evaluateRouteAccess({ path: '/apply/mentor', ...signedOut }).status).toBe('allowed');
    expect(evaluateRouteAccess({ path: '/signin', ...signedOut }).status).toBe('allowed');
  });

  it('bounces signed-in users off public-only routes', () => {
    expect(accessTo('/signin', participant)).toMatchObject({
      status: 'denied',
      redirectTo: '/',
    });
  });

  it('does not treat /admin/rsvp as the public /rsvp route', () => {
    expect(accessTo('/admin/rsvp/mentors', admin).status).toBe('allowed');
  });

  it('holds rendering while auth is loading', () => {
    expect(
      evaluateRouteAccess({
        path: '/admin',
        hasSession: true,
        isAuthLoading: true,
        capabilities: new Set<Capability>(),
      }),
    ).toMatchObject({ status: 'pending', redirectTo: null });
  });

  it('keeps the fallback route reachable rather than dead-ending', () => {
    const noHome = deriveCapabilities(roles({ canAccessParticipant: true }), {
      ...ALL_FLAGS_ON,
      home: false,
    });

    expect(accessTo('/', noHome).status).toBe('allowed');
  });
});
