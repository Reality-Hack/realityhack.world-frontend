import React, { useState, useRef, useEffect, Dispatch,SetStateAction } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button } from 'antd';
import type { InputRef } from 'antd';

interface SelectToolWithOtherProps {
  // Add any additional props if needed
  placeholder: string;
  mentorTopics: string[];
  canSubmit: (submissionState:boolean) => void;
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
}
const SelectToolWithOther: React.FC<SelectToolWithOtherProps> = ({
  mentorTopics,
  placeholder, 
  canSubmit,
  selectedItems,
  setSelectedItems
}) => {
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);
  // const [selectedItems, setSelectedItems] = useState<string[]>([]); // New state variable

  useEffect(()=>{
    if (selectedItems.length > 0) {
      canSubmit(true)
    }
    else{
      canSubmit(false)
    }
  },[selectedItems])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Check if there are items in the filtered list
      const filteredItems = mentorTopics.filter(item =>
        item.toLowerCase().includes(name.toLowerCase())
      );
      if (filteredItems.length > 0) {
        // Add the top item to selectedItems
        handleSelection(filteredItems[0]);
      } else {
        // If no items are filtered, add the current input value to selectedItems
        addItem(name.trim());
      }
    }
  };

  function handleSelection(value: string) {
    setSelectedItems(prevSelectedItems => {
      // Check if itemName is not already included in prevSelectedItems
      if (!prevSelectedItems.includes(value)) {
        // If not included, add the value to the array
        return [...prevSelectedItems, value];
      }
      // If included, return the array as it is (no duplicates)
      return prevSelectedItems;
    });
    
  }

  const addItem = (
    newItem: string | React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    const itemName = typeof newItem === 'string' ? newItem : name.trim();

    if (itemName !== '') {
      // setItems([...items, itemName]);
      setName('');
      setSelectedItems(prevSelectedItems => {
        // Check if itemName is not already included in prevSelectedItems
        if (!prevSelectedItems.includes(itemName)) {
          // If not included, add the itemName to the array
          return [...prevSelectedItems, itemName];
        }
        // If included, return the array as it is (no duplicates)
        return prevSelectedItems;
      });
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  function removeSkill(val: string) {
    setSelectedItems(prevSelectedItems => {
      // Filter out the item to be removed
      const updatedSelectedItems = prevSelectedItems.filter(
        item => item !== val
      );
      return updatedSelectedItems;
    });
    console.log('deleting');
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((el, idx) => (
          <SkillTag
            key={idx}
            skill={el}
            color={`blue`}
            onDelete={() => removeSkill(el)}
          />
        ))}
      </div>
      <Select
        style={{ width: 300 }}
        placeholder={`${placeholder}`}
        dropdownRender={menu => (
          <div>
            <Space style={{ padding: '0 8px 4px' }}>
              <Input
                placeholder="Please enter item"
                ref={inputRef}
                value={name}
                onChange={onNameChange}
                // onKeyDown={(e) => e.stopPropagation()}
                onKeyDown={handleKeyPress}
              />
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => addItem(name)}
              >
                Add item
              </Button>
            </Space>
            <Divider style={{ margin: '8px 0' }} />
            {menu}
          </div>
        )}
        options={mentorTopics
          .filter((item) => !selectedItems.includes(item)) // Filter out selected items
          .filter((item) => item.toLowerCase().includes(name.toLowerCase()))
          .sort()
          .map((item) => ({
            label: item,
            value: item,
          }))}
        onSelect={value => handleSelection(value)}
        showSearch={true}
        onSearch={value => setName(value)}
        // mode="tags"
      />
    </div>
  );
};

export default SelectToolWithOther;

interface SkillTagProps {
  skill: string;
  color?: string;
  onDelete: () => void; // Rename the prop to onDelete
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, color, onDelete }) => {
  const colors = ['red', 'blue', 'green', 'orange'];
  const randomColor =
    color || colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className={`p-2 border-1 border-black rounded-lg hover:cursor-pointer flex gap-1 items-center`}
      style={{ backgroundColor: `light${randomColor}`, color: randomColor }}
    >
      <div
        onClick={onDelete}
        className="bg-red-300 px-2 text-white rounded-lg text-red-500 font-bold"
      >
        -
      </div>
      <div>{skill}</div>
    </div>
  );
};
