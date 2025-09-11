'use client';
import HardwareRequestView from '@/components/HardwareRequestView';
import { useHardwareContext } from '@/contexts/HardwareAdminContext';
import { useEffect } from 'react';

export default function HardwareRequests() {
  const { setHardwareRequestParams } = useHardwareContext();
  useEffect(() => {
    setHardwareRequestParams({
      requester__id: undefined,
    });
  }, []);
  return <HardwareRequestView statusEditable={true}></HardwareRequestView>;
}
