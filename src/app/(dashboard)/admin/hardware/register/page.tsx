'use client';
import HardwareEditor from '@/components/hardware/HardwareEditor';
import { LinearProgress } from '@mui/material';
import { TaggedHardware } from '@/types/types2';
import { useMemo } from 'react';
import { HardwareCount, TagsEnum } from '@/types/models'
import { useHardwareContext } from '@/contexts/HardwareAdminContext';
import { HardwareCategory } from '@/types/types2';

export default function Register() {
  const { hardwareDeviceTypes, hardwareCategories } = useHardwareContext();

  const taggedHardware = useMemo((): TaggedHardware[] => {
    if (!hardwareDeviceTypes || !hardwareCategories) return [];
    return hardwareDeviceTypes.map((hardware: HardwareCount) => ({
      ...hardware,
      mappedTags: hardwareCategories.filter((tag: HardwareCategory) => hardware.tags.includes(tag.value))
    }));
  }, [hardwareDeviceTypes, hardwareCategories]);

  return (
    <>
      {hardwareDeviceTypes == null || hardwareCategories == null ? (
        <LinearProgress />
      ) : (
        <HardwareEditor
          hardware={taggedHardware}
          hardwareCategories={hardwareCategories}
        ></HardwareEditor>
      )}
    </>
  );
}
