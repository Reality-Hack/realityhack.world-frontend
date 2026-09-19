/** Build-time VITE_IS_*_ENABLED switches, resolved to booleans. */
export interface FeatureFlags {
  home: boolean;
  admin: boolean;
  schedule: boolean;
  sponsorDashboard: boolean;
  showcase: boolean;
  tracks: boolean;
  hardwareCheckout: boolean;
  teams: boolean;
  hackerHelp: boolean;
  mentorHelp: boolean;
  workshops: boolean;
  resources: boolean;
  eventGuide: boolean;
  settings: boolean;
  hackersMet: boolean;
  lighthouses: boolean;
  events: boolean;
  sponsorAdmin: boolean;
}

const isEnabled = (value: unknown): boolean => value === 'true';

/** The build-time feature switches, read once. */
export const FEATURE_FLAGS: FeatureFlags = {
  home: isEnabled(import.meta.env.VITE_IS_HOME_ENABLED),
  admin: isEnabled(import.meta.env.VITE_IS_ADMIN_ENABLED),
  schedule: isEnabled(import.meta.env.VITE_IS_SCHEDULE_ENABLED),
  sponsorDashboard: isEnabled(import.meta.env.VITE_IS_SPONSOR_DASHBOARD_ENABLED),
  showcase: isEnabled(import.meta.env.VITE_IS_SHOWCASE_ENABLED),
  tracks: isEnabled(import.meta.env.VITE_IS_TRACKS_ENABLED),
  hardwareCheckout: isEnabled(import.meta.env.VITE_IS_HARDWARE_CHECKOUT_ENABLED),
  teams: isEnabled(import.meta.env.VITE_IS_TEAMS_ENABLED),
  hackerHelp: isEnabled(import.meta.env.VITE_IS_HACKER_HELP_ENABLED),
  mentorHelp: isEnabled(import.meta.env.VITE_IS_MENTOR_HELP_ENABLED),
  workshops: isEnabled(import.meta.env.VITE_IS_WORKSHOPS_ENABLED),
  resources: isEnabled(import.meta.env.VITE_IS_RESOURCES_TAB_ENABLED),
  eventGuide: isEnabled(import.meta.env.VITE_IS_EVENT_GUIDE_ENABLED),
  settings: isEnabled(import.meta.env.VITE_IS_SETTINGS_TAB_ENABLED),
  hackersMet: isEnabled(import.meta.env.VITE_IS_HACKERS_MET_ENABLED),
  lighthouses: isEnabled(import.meta.env.VITE_IS_LIGHTHOUSES_ENABLED),
  events: isEnabled(import.meta.env.VITE_IS_EVENTS_ENABLED),
  sponsorAdmin: isEnabled(import.meta.env.VITE_IS_SPONSOR_ADMIN_ENABLED),
};
