'use client';
import { HardwareCategory } from '@/types/types2';
import HardwareCard from './HardwareCard';
import { useState } from 'react';
import HardwareCategoryFilter from './HardwareCategoryFilter';
import { HardwareCount } from '@/types/models';

export default function FilteredHardwareRequestViewer({
  hardware,
  hardwareCategories
}: {
  hardware: HardwareCount[];
  hardwareCategories: HardwareCategory[];
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(
    Object.fromEntries(
      hardwareCategories.map((cat: HardwareCategory) => [cat.value, false])
    )
  );

  return (
    <>
      <HardwareCategoryFilter
        hardwareCategories={hardwareCategories}
        search={search}
        setSearch={setSearch}
        selected={selected}
        setSelected={setSelected}
      ></HardwareCategoryFilter>
      <div className="flex flex-wrap justify-left gap-6 ml-6 mt-14">
        {hardware
          .filter(
            (item: HardwareCount) =>
              (item.tags.some(
                  tag => selected[tag?.valueOf() || tag]
                ) ||
                !Object.entries(selected).some(([_, val]) => val)) &&
              (!search ||
                item.name.toLowerCase().includes(search.toLowerCase()))
          )
          .map((item: HardwareCount, i: number) => (
            <HardwareCard
              item={item}
              key={item?.id}
              topLevelProps={{ 'data-testid': `hardware-request-hardware-${i}` }}
            />
          ))}
      </div>
    </>
  );
}
