'use client';
import HardwareEditor from '@/components/HardwareEditor/HardwareEditor';
import { LinearProgress } from '@mui/material';
import { TaggedHardware } from '@/types/types2';
import { useMemo } from 'react';
import { HardwareCount, TagsEnum } from '@/types/models'
import { useHardwareContext } from '@/contexts/HardwareContext';
import { HardwareCategory } from '@/types/types2';

export default function Register() {
  const { isLoadingHardwareDeviceTypes, hardwareCategories } = useHardwareContext();

  return (
    <>
      {isLoadingHardwareDeviceTypes || hardwareCategories == null ? (
        <LinearProgress />
      ) : (
        <HardwareEditor
          hardwareCategories={hardwareCategories}
        ></HardwareEditor>
      )}
    </>
  );
}
