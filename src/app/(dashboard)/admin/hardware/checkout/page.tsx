'use client';
import HardwareCheckout from '@/components/HardwareCheckout/HardwareCheckout';
import { useSession } from 'next-auth/react';
import { useHardwareContext } from '@/contexts/HardwareContext';
import { useEventRsvps } from '@/hooks/useEventRsvps';
import { HardwareDevice } from '@/types/models';
import { useState, useEffect } from 'react';
import { HardwareWithType } from '@/types/types2';

export default function Checkout() {
  const { data: session } = useSession();
  const [mappedHardwareDevices, setMappedHardwareDevices] = useState<HardwareWithType[]>([])
  const { hardwareDevices, hardwareDeviceTypeMap, isLoadingHardwareDevices } = useHardwareContext();

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

  const { rsvpAttendeesWithCheckIn: attendees, isLoading: isLoadingAttendees } = useEventRsvps();

  const isAdmin = session && ['admin', 'organizer'].some(role => session?.roles?.includes(role));

  if (!isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }
  
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

