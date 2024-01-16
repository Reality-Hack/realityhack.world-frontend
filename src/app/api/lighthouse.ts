type RoomEnum = 'MH' | 'AT';
export type Location = {
  id: string;
  building: string;
  room?: RoomEnum;
  created_at: string;
  updated_at: string;
};

export type HelpRequest = {
  created_at: string;
  description: string;
  id: string;
  mentor: string;
  reporter: string;
  status: string;
  team: string;
  title: string;
  updated_at: string;
};
export type HelpRequestHistory = {
  created_at: string;
  description: string;
  history_id: number;
  id: string;
  mentor: string;
  reporter: string;
  status: string;
  team: string;
  title: string;
  updated_at: string;
};

export type Table = {
  id: string;
  number: number;
  location: string;
  created_at: string;
  updated_at: string;
};

export type LightHouseMessage = {
  table: number;
  ip_address: string;
  mentor_requested: string;
  announcement_pending: string;
};
export type Team = {
  attendees: string[];
  created_at: string;
  id: string;
  name: string;
  table: string;
  updated_at: string;
};

/**
 * getAllHelpRequests: makes api call to fetch all teams
 * @param accessToken session token to make connection
 * @returns list of helpRequests objects
 */
export async function getAllHelpRequests(
  accessToken: string
): Promise<HelpRequest[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequests/`;
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
    `Failed to get all tables Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}
/**
 * getAllHelpRequestsFromHistory: makes api call to fetch a team's request history
 * @param accessToken session token to make connection
 * @returns list of helpRequestHistory objects
 */
export async function getAllHelpRequestsFromHistory(
  accessToken: string
): Promise<Table[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequestsHistory/`;
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
    `Failed to get all tables Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

export async function getAllLocations(): Promise<Location[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to get all tables Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

export async function getAllTeams(): Promise<Team> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to get all tables Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

/**
 * getAllTables: makes api call to fetch all teams
 * @param accessToken session token to make connection
 * @returns list of table objects
 */
export async function getAllTables(accessToken: string): Promise<Table[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tables/`;
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
    `Failed to get all tables Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}
// return ("table location")

//mentorHelpRequests(team) >> teams(id) >> table
//lighthouse message has table number which has mentor_requested

export async function editMentorHelpRequest(
  requestId: string,
  updatedData: Partial<HelpRequest>
): Promise<HelpRequest> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequest/${requestId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
      // Include any other headers if needed
    },
    body: JSON.stringify(updatedData)
  });

  const data: HelpRequest | undefined = await response.json();

  if (response.ok) {
    if (data) {
      return data;
    } else {
      throw new Error('Unexpected empty response.');
    }
  } else {
    throw new Error(
      `Failed to update help request. Status: ${
        response.status
      }\n Result: ${JSON.stringify(data)}`
    );
  }
}

export async function addMentorHelpRequest(
  newRequest: HelpRequest
): Promise<HelpRequest> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequest/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // Include any other headers if needed
    },
    body: JSON.stringify(newRequest)
  });

  const data: HelpRequest | undefined = await response.json();

  if (response.ok) {
    if (data) {
      return data;
    } else {
      throw new Error('Unexpected empty response.');
    }
  } else {
    throw new Error(
      `Failed to add mentor help request. Status: ${
        response.status
      }\n Result: ${JSON.stringify(data)}`
    );
  }
}
