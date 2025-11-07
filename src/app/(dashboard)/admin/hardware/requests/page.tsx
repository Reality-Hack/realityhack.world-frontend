'use client';
import HardwareRequestTable from '@/components/HardwareRequestTable/HardwareRequestTable';
import { useHardwareContext } from '@/contexts/HardwareContext';
import { useEffect } from 'react';

export default function HardwareRequests() {
  const { setHardwareRequestParams } = useHardwareContext();
  useEffect(() => {
    setHardwareRequestParams({
      requester__id: undefined,
    });
  }, []);
  return <HardwareRequestTable statusEditable={true} />;
}
