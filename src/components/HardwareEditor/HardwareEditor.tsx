'use client';
import { useMemo, useState } from 'react';
import {
  HardwareCategory,
} from '@/types/types2';
import HardwareCategoryFilter from '@/components/hardware/HardwareCategoryFilter';
import { HardwareCount } from '@/types/models';
import { useHardwareContext } from '@/contexts/HardwareContext';
import EditableHardwareCard from './EditableHardwareCard';


export default function HardwareEditor({
  hardwareCategories
}: {
  hardwareCategories: HardwareCategory[];
}) {
  const { hardwareDeviceTypes, selectedHardwareCategories, searchTerm } = useHardwareContext();
  const [userCreatedHardware, setUserCreatedHardware] = useState<HardwareCount | null>(null);

  // TODO: fix this type error with an extension of CreateHardware
  const filteredHardware = useMemo(() => {
    if (!hardwareDeviceTypes) return [];
    const filteredHardware = hardwareDeviceTypes.filter((item: HardwareCount) => {
      const passesTagFilter = 
        item.tags.some(
          tag => selectedHardwareCategories[tag || (tag as unknown as string)]
        ) ||
        !Object.entries(selectedHardwareCategories).some(([_, val]) => val);
      
      const passesSearchFilter = !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return passesTagFilter && passesSearchFilter;
    });
    if (userCreatedHardware) {
      filteredHardware.unshift(userCreatedHardware);
    }
    return filteredHardware;
  }, [hardwareDeviceTypes, selectedHardwareCategories, searchTerm, userCreatedHardware]);

  // add a new hardware device type to the existing list
  function addNew() {
    setUserCreatedHardware(
      {
        id: '',
        name: '',
        total: 1,
        available: 1,
        description: '',
        image: {
          file: '',
        },
        checked_out: 0,
        tags: []
      },
    );
  }

  const removeUserCreatedHardware = () => {
    setUserCreatedHardware(null);
  }

  return (
    <div>
      <button
        className="cursor-pointer text-white bg-[#493B8A] p-4 m-4 rounded-full disabled:opacity-50 transition-all h-15 self-end flex flex-row"
        onClick={() => addNew()}
      >
        <span className="text-3xl">+</span>{' '}
        <span className="py-2 px-2">add new</span>
      </button>
      <HardwareCategoryFilter/>
      <div className="flex flex-wrap justify-left gap-6 ml-6 mt-14">
        {filteredHardware.map((item: any, i: number) => (
          <EditableHardwareCard
            item={item}
            removeUserCreatedHardware={removeUserCreatedHardware}
            key={`${item.id}-${item.name}-${i}`}
            hardwareCategories={hardwareCategories}
            topLevelProps={{
              'data-testid': `hardware-request-hardware-${i}`
            }}
          />
        ))}
      </div>
    </div>
  );
}
