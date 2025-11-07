export const AUTH_ERRORS = {
  ACCESS_DENIED: "You don't have the necessary permissions to access this application. Please contact your administrator if you believe this is an error. Blah blah blah",
  NO_CLIENT_ROLES: "Looks like your credentials are correct but aren't valid for our 2026 event. Please try again after receiving a Reality Hack at MIT 2026 acceptance.",
  REFRESH_TOKEN_ERROR: 'Your session has expired. Please sign in again.',
  GENERAL_ERROR: 'An authentication error occurred. Please try again.'
} as const;

export const AUTH_ERROR_TITLES = {
  ACCESS_DENIED: 'Authentication Error',
  NO_CLIENT_ROLES: "Hmm, there's nothing here for you right now.",
  REFRESH_TOKEN_ERROR: 'Authentication Error',
  GENERAL_ERROR: 'Authentication Error'
} as const;

export const AUTH_ERROR_TYPES = {
  ACCESS_DENIED: 'AccessDenied',
  NO_CLIENT_ROLES: 'NoClientRoles', 
  REFRESH_TOKEN_ERROR: 'RefreshAccessTokenError',
  GENERAL_ERROR: 'GeneralError'
} as const;
