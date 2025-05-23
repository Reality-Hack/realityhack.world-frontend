type RoomEnum = 'MH' | 'AT';
export type Location = {
  id: string;
  building: string;
  room?: RoomEnum;
  created_at: string;
  updated_at: string;
};

export type HelpRequestTable = {
  id: string;
  number: number;
  location: Location;
};

export type HelpRequestTeam = {
  id: string;
  name: string;
  table: HelpRequestTable;
  location: Location;
};

export type HelpRequestReporter = {
  id: string;
  first_name: string;
  last_name: string;
};

export type HelpRequest = {
  created_at: string;
  description: string;
  id: string;
  mentor: string;
  reporter: HelpRequestReporter;
  status: string;
  team: HelpRequestTeam;
  title: string;
  updated_at: string;
  topic: string[];
  reporter_location?: string;
};

export type CreateHelpRequest = {
  team: string;
  topic: string[];
  description?: string;
  mentor?: string;
  reporter?: string; //an attendee
  title?: string;
  reporter_location?: string;
  // category?: string; //dapms
  // category_specialty?: string;
  topic_other?: string;
};
export type EditHelpRequest = {
  team: string;
  topics: string[];
  description?: string;
  mentor?: string;
  reporter: string; //an attendee
  status?: string;
  title?: string;
  // category?: string; //dapms - not using this
  // category_specialty?: string; //deprecated - not using this
  topic_other?: string;
};

export type HelpRequestHistory = {
  created_at: string;
  description: string;
  history_id: number;
  id: string;
  mentor: string;
  reporter: string;
  topic: Array<string>;
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
    `Failed to get all help requests. Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}
/**
 * BROKEN
 * getAllMyHelpRequests: makes api call to fetch the team's help req object
 * @param accessToken session token to make connection
 * @param teamId teamId to filter helpRequests
 * @returns list of helpRequests objects
 */
export async function getAllMyTeamsHelpRequests(
  accessToken: string,
  teamId: string
): Promise<HelpRequest[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequests?team=${teamId}`;
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
    `Failed to get all team help requests. Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}
/**
 * BROKEN
 * getAllMyHelpRequests: makes api call to fetch the team's help req object
 * @param accessToken session token to make connection
 * @param teamId teamId to filter helpRequests
 * @returns list of helpRequests objects
 */
export async function getAllMyTeamsHistoricalHelpRequests(
  accessToken: string,
  teamId: string
): Promise<HelpRequestHistory[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequestshistory/?team=${teamId}`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken,
      teamId: teamId
    }
  });
  const result = await resp.json();
  if (resp.ok) {
    return result;
  }
  throw new Error(
    `Failed to get all personal team historical help requests. Status: ${resp.status}\n Result: ${JSON.stringify(
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
  accessToken: string,
  mentorTopcis?: string[]
): Promise<HelpRequestHistory[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequestshistory/`;
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
    `Failed to get all historical help requests. Status: ${resp.status}\n Result: ${JSON.stringify(
      result
    )}`
  );
}

/**
 *
 * @param attendeeId the attendee id sting
 * @returns teamId string
 */
// export async function getTeamIdFromAttendeeId(attendeeId:string): Promise<Team[]> {
//   const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams?attendees=${attendeeId}`;
//   const resp = await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
//   const result = await resp.json();
//   if (resp.ok) {
//     return result;
//   }
//   throw new Error(
//     `Failed to get team info. Status: ${resp.status}\n Result: ${JSON.stringify(
//       result
//     )}`
//   );
// }

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

export async function editMentorHelpRequest(
  accessToken: string,
  requestId: string,
  updatedData: Partial<EditHelpRequest>
): Promise<HelpRequest> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequests/${requestId}/`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    },
    body: JSON.stringify(updatedData)
  });
  if (resp.ok) {
    return resp.json();
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function addMentorHelpRequest(
  accessToken: string,
  newRequest: CreateHelpRequest
): Promise<HelpRequest> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequests/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: JSON.stringify(newRequest)
  });

  const data: HelpRequest = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw new Error(
      `Failed to add mentor help request. Status: ${
        response.status
      }\n Result: ${JSON.stringify(data)}`
    );
  }
}

export async function deleteMentorHelpRequest(
  accessToken: string,
  requestId: string
): Promise<HelpRequest> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequests/${requestId}/`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  const data: HelpRequest = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw new Error(
      `Failed to delete mentor help request. Status: ${
        response.status
      }\n Result: ${JSON.stringify(data)}`
    );
  }
}

//mentor one
export async function updateHelpRequestStatus(
  accessToken: string,
  requestId: string,
  status: 'R' | 'A' | 'E' | 'F'
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mentorhelprequest/${requestId}/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: JSON.stringify({
      status
    })
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
      `Failed to patch mentor help request. Status: ${
        response.status
      }\n Result: ${JSON.stringify(data)}`
    );
  }
}
