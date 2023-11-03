export async function getAllHackerApplications() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });

  if (resp.ok) {
    return await resp.json();
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}
