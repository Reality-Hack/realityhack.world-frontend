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
