'use client';

import { getHardwareCategories } from '@/app/api/hardware';
import { useHardwareList } from '@/types/endpoints';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import FilteredHardwareRequestViewer from '@/components/hardware/FilteredHardwareRequestViewer';
import Loader from '@/components/Loader';
import { HardwareCategory } from '@/types/types2';

export default function HardwareRequest() {
  const { data: session } = useSession();
  const [hardwareCategories, setHardwareCategories] = useState<HardwareCategory[]>([]);
  const { data: hardwareData, isLoading: isLoadingHardware, error: hardwareError } = useHardwareList({}, {
    swr: { enabled: !!session?.access_token}, 
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  useEffect(() => {
    const fetchHardwareCategories = async () => {
      if (session?.access_token) {
        const response: HardwareCategory[] = await getHardwareCategories(session?.access_token);
        setHardwareCategories(response);
      }
    };
    fetchHardwareCategories();
  }, [session]);

  if (isLoadingHardware) {
    return <Loader />;
  }

  if (hardwareError) {
    return (
      <p className="text-lg text-center text-red-600">
        {hardwareError.message}
      </p>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <FilteredHardwareRequestViewer
      hardware={hardwareData || []}
      hardwareCategories={hardwareCategories || []}
    />
  );
}
