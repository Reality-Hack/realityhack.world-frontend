import { status } from '@/types/types';

export async function getAllHackerApplications(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/`;
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

export async function updateApplicationStatus(
  appID: string,
  status: status | null,
  accessToken: string
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/${appID}`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: JSON.stringify({ status })
  });
  if (resp.ok) {
    return await resp.json();
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function getApplication(id: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/${id}`;
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

export async function applicationOptions(data: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/`;
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

export async function createApplication(data: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/applications/`;
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

export async function fileUpload(file: File) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploaded_files/`;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error('Failed to upload file. ' + error.message);
  }
}

export async function patchFileUpload(fileId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploaded_files/${fileId}/`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ claimed: true })
    });

    if (!response.ok) {
      throw new Error(
        `Failed to patch file upload. Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    throw new Error('Failed to update file upload. ' + error.message);
  }
}

export async function updateApplication(id: string, data: string) {
  const url = `${process.env.BACKEND_URL}/applications/${id}`;
  const resp = await fetch(url, {
    method: 'PATCH',
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
