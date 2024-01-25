import React, { useState } from "react";

interface FilterItemsMenuProps {
  items: string[];
  onChange: (checkedItems: string[]) => void;
}

interface FilterItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function FilterItemsMenu({ items, onChange }: FilterItemsMenuProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheckboxChange = (label: string) => {
    const isChecked = checkedItems.includes(label);
    const updatedItems = isChecked
      ? checkedItems.filter((item) => item !== label)
      : [...checkedItems, label];

    setCheckedItems(updatedItems);
    onChange(updatedItems); // Call the onChange method with the updated array
  };

  const components = items.map((item) => (
    <FilterItem
      key={item}
      label={item}
      checked={checkedItems.includes(item)}
      onChange={() => handleCheckboxChange(item)}
    />
  ));

  return (
    <div>
      <div className="">Select Items or Search</div>
      {components}
    </div>
  );
}

function FilterItem({ checked, label, onChange }: FilterItemProps) {
  return (
    <div className="flex flex-row">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div>{label}</div>
    </div>
  );
}
