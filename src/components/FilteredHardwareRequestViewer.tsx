'use client';
import { Hardware, HardwareCategory } from '@/types/types';
import HardwareCard from './HardwareCard';
import { useState } from 'react';
import HardwareCategoryFilter from './HardwareCategoryFilter';

export default function FilteredHardwareRequestViewer({
  hardware,
  hardwareCategories
}: {
  hardware: any;
  hardwareCategories: any;
}) {
  const [search, setSearch] = useState('');
  const [selectAll, setSelectAll] = useState(false);
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
        selectAll={selectAll}
        setSelectAll={setSelectAll}
      ></HardwareCategoryFilter>
      <div className="flex flex-wrap justify-left gap-6 ml-6 mt-14">
        {hardware
          .filter(
            (item: Hardware) =>
              (selectAll ||
                item.tags.some(
                  tag => selected[tag?.value || (tag as unknown as string)]
                ) ||
                !Object.entries(selected).some(([_, val]) => val)) &&
              (!search ||
                item.name.toLowerCase().includes(search.toLowerCase()))
          )
          .map((item: any, i: number) => (
            <HardwareCard item={item} key={item?.id} topLevelProps={{"data-testid": `hardware-request-hardware-${i}`}}></HardwareCard>
          ))}
      </div>
    </>
  );
}
