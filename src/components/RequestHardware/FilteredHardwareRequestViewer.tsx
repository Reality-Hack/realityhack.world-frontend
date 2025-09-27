'use client';
import { HardwareCategory } from '@/types/types2';
import HardwareCard from './HardwareCard';
import { useMemo, useState } from 'react';
import HardwareCategoryFilter from '../hardware/HardwareCategoryFilter';
import { HardwareCount } from '@/types/models';
import { useHardwareContext } from '@/contexts/HardwareContext';
import { useAuthContext } from '@/hooks/AuthContext';

export default function FilteredHardwareRequestViewer({
}) {
  const { filteredHardwareTypes } = useHardwareContext();
  const { user: currentUser } = useAuthContext();
  return (
    <>
      <HardwareCategoryFilter/>
      <div className="flex flex-wrap justify-left gap-6 ml-6 mt-14">
          { filteredHardwareTypes && filteredHardwareTypes.length > 0 
          ? filteredHardwareTypes.map((item: HardwareCount, i: number) => (
            <HardwareCard
              item={item}
              key={item?.id}
              identifier={`hardware-request-hardware-${i}`}
              teamId={currentUser?.team?.id || null}
            />
          )) : <p className="text-lg text-center text-gray-500">No hardware types found</p>}
      </div>
    </>
  );
}
