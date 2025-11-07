'use client';
import CloseIcon from '@mui/icons-material/Close';
import { HardwareCategory, hardware_categories } from '@/types/types2';
import { useState } from 'react';
import { useHardwareContext } from '@/contexts/HardwareContext';


export default function HardwareCategoryFilter(
) {
  const { 
    hardwareCategories, 
    selectedHardwareCategories, 
    setSelectedHardwareCategories, 
    searchTerm, 
    setSearchTerm 
  } = useHardwareContext();
  const [filterOn, setFilterOn] = useState(false);
  return <div className="flex flex-col items-end">
    <button
      className="fixed bg-[#493B8A] px-7 py-2 rounded-full text-white right-[4%] top-[4%] z-10"
      onClick={() => setFilterOn(!filterOn)}
    >
      Filter
    </button>
    {filterOn && (
      <div className="fixed rounded-md shadow-xl bg-white z-10 right-[4%] top-[8%]">
        <div className='flex flex-end justify-end'>
          <button
            className="self-end rounded-full text-black mx-4"
            onClick={() => setFilterOn(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <div>
          <div className="w-56 px-5 py-4 my-4 mr-4 content">
            <h3 className="inline-block -my-3">
              <span className="font-semibold">Categories</span>
            </h3>
            <input
              className="my-1 shadow-md"
              placeholder="Search hardware"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            ></input>
            {hardwareCategories.map(
              (cat: HardwareCategory, idx: number) => (
                <div className="flex items-center" key={idx}>
                  <input
                    id={`filter-${cat.value}`}
                    name={hardware_categories[cat.value]}
                    defaultValue={hardware_categories[cat.value]}
                    type="checkbox"
                    defaultChecked={selectedHardwareCategories[cat.value]}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    onClick={ev => {
                      const checked = ev.currentTarget.checked;
                      setSelectedHardwareCategories({ ...selectedHardwareCategories, [cat.value]: checked });
                    }}
                  />
                  <label
                    htmlFor={`filter-${cat.value}`}
                    className="ml-3 text-sm"
                  >
                    {hardware_categories[cat.value]}
                  </label>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    )}
  </div>
}
