'use client';
import HardwareEditor from '@/components/HardwareEditor/HardwareEditor';
import { LinearProgress } from '@mui/material';
import { TaggedHardware } from '@/types/types2';
import { useMemo } from 'react';
import { HardwareCount, TagsEnum } from '@/types/models'
import { useHardwareContext } from '@/contexts/HardwareContext';
import { HardwareCategory } from '@/types/types2';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const { isLoadingHardwareDeviceTypes, hardwareCategories } = useHardwareContext();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }
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
