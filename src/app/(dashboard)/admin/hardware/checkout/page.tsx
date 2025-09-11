'use client';
import HardwareCheckout from '@/components/hardware/HardwareCheckout';
import { useSession } from 'next-auth/react';
import { useHardwareContext } from '@/contexts/HardwareAdminContext';
import { useAttendeesList } from '@/types/endpoints';
import { HardwareDevice } from '@/types/models';
import { useState, useEffect } from 'react';
import { HardwareWithType } from '@/types/types2';

export default function Checkout() {
  const { data: session } = useSession();
  const [mappedHardwareDevices, setMappedHardwareDevices] = useState<HardwareWithType[]>([])
  const { hardwareDevices, hardwareDeviceTypeMap, isLoadingHardwareDevices } = useHardwareContext();
  const {data: attendees, isLoading: isLoadingAttendees} = useAttendeesList({}, {
    swr: { enabled: !!session?.access_token}, 
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  const isAdmin = session && ['admin', 'organizer'].some(role => session?.roles?.includes(role));

  if (!isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }

  useEffect(() => {
    if (!hardwareDevices || !hardwareDeviceTypeMap) {
      return;
    }
    const mappedDevices = hardwareDevices
      ?.map((item: HardwareDevice) => ({
        ...item,
        hardwareType: hardwareDeviceTypeMap[item.hardware]
      })).filter((item: HardwareWithType) => item.hardwareType)
    setMappedHardwareDevices(mappedDevices);
  }, [hardwareDevices, hardwareDeviceTypeMap])
  
  return (
    isLoadingAttendees || isLoadingHardwareDevices ? (
      <div>Loading...</div>
    ) : (attendees && mappedHardwareDevices && (
      <HardwareCheckout
        attendees={attendees}
        hardware={mappedHardwareDevices}
      />
    ))
  );
}

