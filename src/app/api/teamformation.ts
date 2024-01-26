import { components } from '@/types/schema';

export type DestinyTeam = components['schemas']['DestinyTeam'];
export type DestinyTeamAttendeeVibe =
  components['schemas']['DestinyTeamAttendeeVibe'];

export async function postVibeCheck(
  accessToken: string,
  vibeCheck: string,
  attendeeId: string,
  destinyTeam: string
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/destinyteamattendeevibes/`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    },
    body: JSON.stringify({
      destiny_team: destinyTeam,
      attendee: attendeeId,
      vibe: vibeCheck
    })
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}
export async function updateIntendedTrack(
  accessToken: string,
  intendedTracks: string[],
  attendeeId: string
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${attendeeId}/`;

  const resp = await fetch(url, {
    method: 'PATCH', // Set the HTTP method to PATCH
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    },
    body: JSON.stringify({
      intended_tracks: intendedTracks
    })
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}
export async function setHardwareTrackPreference(
  accessToken: string,
  intendedTracks: string,
  attendeeId: string
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${attendeeId}/`;

  const resp = await fetch(url, {
    method: 'PATCH', // Set the HTTP method to PATCH
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    },
    body: JSON.stringify({
      intended_tracks: intendedTracks
    })
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function getAvailableTracks(
  accessToken: string
): Promise<{ choices: { value: string; display_name: string }[] } | undefined> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/destinyteams/`;

  try {
    const response: Response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    });

    if (response.ok) {
      const data: {
        actions: {
          POST: {
            track: { choices: { value: string; display_name: string }[] };
          };
        };
      } = await response.json();
      return data?.actions?.POST?.track;
    } else {
      throw new Error(`Options request failed: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`An error occurred during the Options request: ${error}`);
  }
}

export async function getDestinyTeamsByAttendee(
  accessToken: string,
  attendeeId: string,
  round: number
): Promise<DestinyTeam[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/destinyteams/?attendees=${attendeeId}&round=${round}`;
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
    `Failed to get destiny teams Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

export async function getAttendeeVibeForTeam(
  accessToken: string,
  destinyTeamId: string,
  attendeeId: string
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/destinyteamattendeevibes/?destiny_team=${destinyTeamId}&attendee=${attendeeId}`;
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
    `Failed to get destiny team attendee vibe Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

export async function createAttendeeVibeForTeam(
  accessToken: string,
  destinyTeamId: string,
  attendeeId: string,
  vibe: number
): Promise<DestinyTeamAttendeeVibe> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/destinyteamattendeevibes/`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: JSON.stringify({
      vibe: vibe,
      destiny_team: destinyTeamId,
      attendee: attendeeId
    })
  });
  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to create destiny team attendee vibe Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

export async function updateAttendeeVibeForTeam(
  accessToken: string,
  attendeevibeId: string,
  vibe: number
): Promise<DestinyTeamAttendeeVibe> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/destinyteamattendeevibes/${attendeevibeId}/`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: JSON.stringify({
      vibe: vibe
    })
  });
  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to patch destiny team attendee vibe Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}
