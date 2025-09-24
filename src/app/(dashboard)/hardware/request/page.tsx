'use client';

import { getHardwareCategories } from '@/app/api/hardware';
import { useHardwareList } from '@/types/endpoints';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import FilteredHardwareRequestViewer from '@/components/hardware/FilteredHardwareRequestViewer';
import Loader from '@/components/Loader';
import { HardwareCategory } from '@/types/types2';
import { useHardwareContext } from '@/contexts/HardwareAdminContext';

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
