export async function submitVibeCheck(
  accessToken: string,
  vibeCheck: string,
  attendeeId: string,
  destinyTeam: string
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/destinyteamattendeevibes/`;

  const resp = await fetch(url, {
    method: 'PATCH',
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


export async function getTeamFormationTeam(){
  
}