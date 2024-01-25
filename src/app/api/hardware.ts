import {
  IncompleteHardwareRequest,
  HardwareRequest,
  hardware_requester,
  HardwareCategory,
  hardware_request_status,
  HardwareRequestBrief,
  Hardware,
  HardwareForSending
} from '@/types/types';

export async function getAllHardware(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardware/`;

  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function getAllHardwareDevices(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardwaredevices/`;

  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function getHardwareCategories(
  accessToken: string
): Promise<HardwareCategory[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardware/`;

  const resp = await fetch(url, {
    method: 'OPTIONS',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    const options = await resp.json();
    const data = options!['actions']['POST']['tags']['choices'];
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function getHardwareRequests(
  accessToken: string,
  requester: hardware_requester
) {
  // TODO: why is dash replacement necessary?
  const request_postfix =
    requester === null ? '' : '?requester__id=' + requester.replaceAll('-', '');
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardwarerequests/${request_postfix}`;

  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function sendHardwareRequest(
  accessToken: string,
  request: IncompleteHardwareRequest
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardwarerequests/`;
  const content = JSON.stringify(request);
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: content
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to send data. Status: ' + resp.status);
}

export async function patchHardwareRequest(
  accessToken: string,
  id: string,
  request: Partial<HardwareRequest | HardwareRequestBrief>
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardwarerequests/${id}/`;
  if (request.status == hardware_request_status.checked_out) {
    if (request.hardware_device == null) {
      throw new Error('Cannot check out hardware without a device');
    }
    const urlDevice = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardwaredevices/${request.hardware_device.id}/`;
    const resp = await fetch(urlDevice, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + accessToken
      },
      body: JSON.stringify({ checked_out_to: id })
    });

    if (!resp.ok) {
      throw new Error('Failed to send data. Status: ' + resp.status);
    }
  }
  const content = JSON.stringify({
    ...request,
    hardware_device: request.hardware_device?.id
  });
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: content
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to send data. Status: ' + resp.status);
}

export async function deleteHardwareRequest(accessToken: string, id: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardwarerequests/${id}/`;
  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    return;
  }

  throw new Error('Failed to send data. Status: ' + resp.status);
}

export async function getHardwareDevice(
  accessToken: string,
  { id = null, serial = null }: { id?: string | null; serial?: string | null }
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardwaredevices${
    id == null ? '' : '/' + id
  }/${serial == null ? '' : '?serial=' + serial}`;

  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export async function getHardware(accessToken: string, id: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardware/${id}/`;

  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to fetch data. Status: ' + resp.status);
}

// TODO manually pop total and create hardware devices
export async function createHardware(
  accessToken: string,
  hardware: Partial<HardwareForSending>
) {
  delete hardware.total;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardware/`;
  const content = JSON.stringify(hardware);
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: content
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to send data. Status: ' + resp.status);
}


// TODO manually pop total and remove hardware devices
export async function updateHardware(
  accessToken: string,
  hardware: Partial<HardwareForSending>
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardware/${hardware.id}/`;
  const content = JSON.stringify(hardware);
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: content
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Failed to send data. Status: ' + resp.status);
}

export async function deleteHardware(accessToken: string, id: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hardware/${id}/`;
  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    }
  });

  if (resp.ok) {
    return;
  }

  throw new Error('Failed to send data. Status: ' + resp.status);
}
