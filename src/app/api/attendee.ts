import { components } from '@/types/schema';

export type Attendee = components['schemas']['Attendee'];

export async function getMe(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/me/`;

  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    }
  });

  if (resp.ok) {
    return await resp.json();
  }
  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function patchMe(accessToken: string, data: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/me/`;

  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    },
    body: JSON.stringify(data)
  });

  if (resp.ok) {
    return await resp.json();
  }
  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function updateAttendee(accessToken: string, data: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendees/${data.id}/`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to update data. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error('Failed to update data. ' + error.message);
  }
}

export async function getAllAttendees(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendees/`;

  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    }
  });

  if (resp.ok) {
    return await resp.json();
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function getAttendee(accessToken: string, id: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendees/${id}/`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    }
  });

  if (resp.ok) {
    return await resp.json();
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}
