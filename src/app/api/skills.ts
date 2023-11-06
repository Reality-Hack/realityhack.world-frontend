export async function getSkills() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/skills/`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to create data. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error('Failed to create data. ' + error.message);
  }
}
