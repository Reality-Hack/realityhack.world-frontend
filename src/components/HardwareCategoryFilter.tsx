'use client';
import CloseIcon from '@mui/icons-material/Close';
import { Hardware, HardwareCategory, hardware_categories } from '@/types/types';
import { useState } from 'react';


export default function HardwareCategoryFilter(
  { hardwareCategories, search, setSearch, selected, setSelected, selectAll, setSelectAll }:
  { hardwareCategories: HardwareCategory[], search: string, setSearch: (search: string) => void,
    selected: any, setSelected: (selected: any) => void, selectAll: boolean,
    setSelectAll: (selectAll: boolean) => void}
) {
  const [filterOn, setFilterOn] = useState(false);
  {/* filter dropdown */}
  return <div className="flex flex-col items-end">
    <button
      className="fixed bg-[#493B8A] px-7 py-2 rounded-full text-white right-[4%] top-[4%] z-10"
      onClick={() => setFilterOn(!filterOn)}
    >
      Filter
    </button>
    {filterOn && (
      <div className="fixed rounded-md shadow-xl bg-white z-10">
        <button
          className="fixed right-0 p-4 px-4 py-2 rounded-full text-black mx-4"
          onClick={() => setFilterOn(false)}
        >
          <CloseIcon />
        </button>
        <div>
          <div className="w-56 px-5 py-4 my-4 mr-4 content">
            {/* <div className="flex flex-col"> */}
            <h3 className="inline-block -my-3">
              <span className="font-semibold">Categories</span>
            </h3>
            <input
              className="my-1 shadow-md"
              placeholder="Search hardware"
              value={search}
              onChange={e => setSearch(e.target.value)}
            ></input>
            {/* </div> */}
            <div className="flex items-center">
              <input
                id={`filter-all`}
                name="All"
                defaultValue="all"
                type="checkbox"
                checked={selectAll}
                onClick={ev => {
                  setSelectAll(
                    (ev.target as unknown as { checked: boolean }).checked
                  );
                  setSelected(
                    Object.fromEntries(
                      Object.entries(selected).map(([key, _]) => [
                        key,
                        false
                      ])
                    )
                  );
                }}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={`filter-all`} className="ml-3 text-sm">
                All
              </label>
            </div>
            {hardwareCategories.map(
              (cat: HardwareCategory, idx: number) => (
                <div className="flex items-center" key={idx}>
                  <input
                    id={`filter-${cat.value}`}
                    name={/*cat.display_name*/ hardware_categories[cat.value]}
                    defaultValue={/*cat.display_name*/ hardware_categories[cat.value]}
                    type="checkbox"
                    checked={selected[cat.value]}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    onClick={ev => {
                      const checked = (ev.target as any).checked;
                      if (checked) {
                        setSelectAll(false);
                      }
                      setSelected({ ...selected, [cat.value]: checked });
                    }}
                  />
                  <label
                    htmlFor={`filter-${cat.value}`}
                    className="ml-3 text-sm"
                  >
                    {/*cat.display_name*/ hardware_categories[cat.value]}
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
