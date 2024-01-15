import { components } from '@/types/schema';
import { Attendee } from './attendee';

export type Team = components['schemas']['Team'];

export type SerializedTeam = {
  id: string;
  name: string;
  attendees: Attendee[];
  table?: components['schemas']['Table'];
  created_at: string;
  updated_at: string;
};

export type PatchedTeam = components['schemas']['PatchedTeam'];

export type TeamCreate = {
  name: string;
  attendees: string[];
  table: string;
};

/**
 * getAllTeams: makes api call to fetch all teams
 * @param accessToken session token to make connection
 * @returns list of team objects
 */
export async function getAllTeams(accessToken: string): Promise<Team[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });
  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to get all teams Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

/**
 * getTeam: makes api call to fetch team by uuid
 * @param teamID team uuid
 * @param accessToken session token to make connection
 * @returns team object with serialized attendees and table objects
 */
export async function getTeam(
  teamID: string,
  accessToken: string
): Promise<SerializedTeam> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamID}/`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to get team. Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

/**
 * updateTeam: makes patch api call to fetch team by uuid
 * @param teamID team uuid
 * @param data patched team data to update
 * @param accessToken session token to make connection
 * @returns updated team object
 */
export async function updateTeam(
  teamID: string,
  data: PatchedTeam,
  accessToken: string
): Promise<Team | void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamID}/`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: JSON.stringify(data)
  });

  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to update team. Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

/**
 * createTeam: makes api call to fetch team by uuid
 * @param team team data
 * @param accessToken session token to make connection
 * @returns created team object
 */
export async function createTeam(
  team: TeamCreate,
  accessToken: string
): Promise<Team> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: JSON.stringify(team)
  });

  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to create team Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

export async function deleteTeam(teamID: string, accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamID}/`;
  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to delete team Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}
