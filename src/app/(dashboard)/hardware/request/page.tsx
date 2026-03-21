'use client';

import { useSession } from '@/auth/client';
import FilteredHardwareRequestViewer from '@/components/RequestHardware/FilteredHardwareRequestViewer';
import Loader from '@/components/Loader';
import { useHardwareContext } from '@/contexts/HardwareContext';

export default function HardwareRequest() {
  const { data: session } = useSession();
  const { isLoadingHardwareDeviceTypes, hardwareDeviceTypesError } = useHardwareContext();

  if (isLoadingHardwareDeviceTypes) {
    return <Loader />;
  }

  if (hardwareDeviceTypesError) {
    return (
      <p className="text-lg text-center text-red-600">
        {hardwareDeviceTypesError.message}
      </p>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <FilteredHardwareRequestViewer/>
  );
}
