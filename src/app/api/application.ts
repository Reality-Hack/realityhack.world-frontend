export async function getAllHackerApplications() {
  const url = `${process.env.BACKEND_URL}/applications/`;
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

export async function getApplication(id: string) {
  const url = `${process.env.BACKEND_URL}/applications/${id}`;
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

export async function createApplication(data: any) {
  const url = `${process.env.BACKEND_URL}/applications`;
  try {
    const response = await fetch(url, {
      method: 'POST',
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

export async function updateApplication(id: string, data: string) {
  const url = `${process.env.BACKEND_URL}/applications/${id}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  });

  if (resp.ok) {
    return await resp.json();
  }

  throw new Error('Failed to update data. Status: ' + resp.status);
}

export async function deleteApplication(id: string) {
  const url = `${process.env.BACKEND_URL}/applications/${id}`;
  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });

  if (resp.ok) {
    return await resp.json();
  }

  throw new Error('Failed to delete data. Status: ' + resp.status);
}
