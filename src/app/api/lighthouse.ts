type RoomEnum = 'MH' | 'AT';
export type Location = {
  id: string;
  building: string;
  room?: RoomEnum;
  created_at: string;
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
  mentor_requested: MentorRequestStatus;
  announcement_pending: AnnouncementStatus;
};

export enum MessageType {
  ANNOUNCEMENT = 'A',
  MENTOR_REQUEST = 'M'
}

export enum AnnouncementStatus {
  SEND = 'S',
  ALERT = 'A',
  RESOLVE = 'F'
}

export enum MentorRequestStatus {
  REQUESTED = 'R',
  ACKNOWLEDGED = 'A',
  EN_ROUTE = 'E',
  RESOLVED = 'F'
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
