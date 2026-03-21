import { DecodedToken } from '@/auth/types';

export function getClientRolesFromToken(decodedToken: DecodedToken): string[] {
  const clientId =
    process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER_CLIENT_ID || process.env.KEYCLOAK_ISSUER_CLIENT_ID || '';

  if (!clientId) {
    return [];
  }

  return decodedToken.resource_access?.[clientId]?.roles ?? [];
}

export function filterEventRoles(roles: string[]): string[] {
  const eventYear =
    process.env.NEXT_PUBLIC_EVENT_YEAR || process.env.EVENT_YEAR || '';

  if (!eventYear) {
    return roles;
  }
  return roles
    .filter((role) => role.includes(`:${eventYear}`))
    .map((role) => role.replace(`:${eventYear}`, ''));
}

export function hasClientRoles(clientRoles: string[]): boolean {
  return filterEventRoles(clientRoles).length > 0;
}
