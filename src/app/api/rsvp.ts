export async function createRsvpForm(data: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/rsvps/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status} Result: ${JSON.stringify(result)}`);
  }

  return result;
}

export async function getAllRSVPs(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/rsvps/`;

  console.log('accessToken', accessToken);

  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    return await resp.json();
  }
  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function rsvpOptions(data: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/rsvps/`;
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to create data. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error('Failed to create data. ' + error.message);
  }
}
