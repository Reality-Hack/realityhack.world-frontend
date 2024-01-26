//helpful files - applications.ts file - for other api calls | ApplicationTable.tsx for frontend component calling the api
//helpful links - devDB - https://dev-api.realityhack.world/schema/swagger/ | https://dev-api.realityhack.world/workshops/

//USER SCHEDULE FOR WORKSHOP

export async function getAllWorkshops(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/workshops/`;

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

export async function getAllAttendedWorkshops(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/workshopattendees/`;

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

//GET USER'S SPECIFIC WORKSHOP SCHEDULE
export async function getMyWorkshops(accessToken: string, userId: string) {
  // const id = '6612aecb-4157-466f-8c51-ef1044af9964';
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/workshopattendees/?attendee=${userId}`;

  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT' + accessToken
    }
  });

  if (resp.ok) {
    return await resp.json();
  }
  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function getWorkshop(accessToken: string, id: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/workshops/${id}`;

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

// take attendance for workshop (user signs in to a specific workshop)
export async function signinToWorkshop(id: string, data: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/workshopattendees/${id}/`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...data
    })
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Failed to create data. Status: ${
        response.status
      } Result: ${JSON.stringify(result)}`
    );
  }

  return result;
}

export async function showInterestInWorkshop(id: string, workshopId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/workshopattendees/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      workshop: workshopId,
      attendee: id
    })
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Failed to create data. Status: ${
        response.status
      } Result: ${JSON.stringify(result)}`
    );
  }

  return result;
}

export async function removeInterestInWorkshop(workshopId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/workshopattendees/${workshopId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Failed to create data. Status: ${
        response.status
      } Result: ${JSON.stringify(result)}`
    );
  }

  return result;
}

//UPDATE A USER'S SPECIFIC WORKSHOP SCHEDULE
export async function updateMyWorkshops() {}

//take in a list of workshops and adds to the work
export async function updateWorkshopSchedule() {}

export async function deleteWorkshopFromSchedule() {}

//update a single workshop's info
export async function updateSpecificWorkshop() {}
