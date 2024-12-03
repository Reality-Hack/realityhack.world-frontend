export async function getPreferencesByAttendeeId(
  accessToken: string,
  prefererId: string
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendeepreferences/?preferer=${prefererId}`;
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
export async function getAllPreferences(
  accessToken: string,
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendeepreferences/`;
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

interface AttendeePreferenceInput {
    preference: "Y" | "N" | "T";
    preferer: string;
    preferee: string;
}
  
  export async function addPreference(
    accessToken: string,
    preferenceInfo: AttendeePreferenceInput
  ) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendeepreferences/`;
    
    const resp = await fetch(url, {
      method: 'POST', // Set the HTTP method to POST for adding a new preference
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify(preferenceInfo),
    });
  
    if (resp.ok) {
      return await resp.json();
    }
  
    throw new Error('Failed to fetch data. Status: ' + resp.status);
  }
  

interface UpdateRequestBody {
    preference?: string | null;
    preferee?: string;
  }
  
  export async function updatePreference(
    accessToken: string,
    preferenceId: string,
    preference?: "Y" | "N" | "T",
    preferee?: string
  ) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendeepreferences/${preferenceId}/`;
  
    const bodyData: UpdateRequestBody = {};
  
    // Optionally add preference
    if (preference !== undefined && preference !== null) {
      bodyData.preference = preference;
    }
  
    // Optionally add preferee 
    if (preferee !== undefined) {
      bodyData.preferee = preferee;
    }
  
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify(bodyData),
    });
  
    if (resp.ok) {
      return await resp.json();
    }
  
    throw new Error('Failed to fetch data. Status: ' + resp.status);
  }
  
  
export async function deletePreference(
  accessToken: string,
  preferenceId: string
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendeepreferences/${preferenceId}`;

  const resp = await fetch(url, {
    method: 'DELETE', // Set the HTTP method to DELETE
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    }
  });

  if (resp.ok) {
    return;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}
