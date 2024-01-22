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

//GET USER'S SPECIFIC WORKSHOP SCHEDULE
export async function getMyWorkshops(accessToken: string, userId: string) {
  const id = '6612aecb-4157-466f-8c51-ef1044af9964';
  // const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/workshopattendees/?attendee=${userId}`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/workshopattendees/?attendee=${id}`;

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

//UPDATE A USER'S SPECIFIC WORKSHOP SCHEDULE
export async function updateMyWorkshops() {}

// take attendance for workshop (user signs in to a specific workshop)
export async function signinToWorkshop() {}

//ADMIN SIDE

//take in a list of workshops and adds to the work
export async function updateWorkshopSchedule() {}

export async function deleteWorkshopFromSchedule() {}

//update a single workshop's info
export async function updateSpecificWorkshop() {}
