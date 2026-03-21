'use client';
import HardwareCheckout from '@/components/HardwareCheckout/HardwareCheckout';
import { useHardwareContext } from '@/contexts/HardwareContext';
import { useEventParticipants } from '@/contexts/EventParticipantsContext';
import { HardwareDevice } from '@/types/models';
import { useState, useEffect } from 'react';
import { HardwareWithType } from '@/types/types2';

export default function Checkout() {
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

  const { 
    rsvpAttendeesWithCheckIn: attendees,
    isLoadingRsvps: isLoadingAttendees 
  } = useEventParticipants();
  
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

