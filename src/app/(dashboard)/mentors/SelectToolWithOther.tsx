import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Divider, Input, Select, Space } from 'antd';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';

interface SelectToolWithOtherProps {
  placeholder: string;
  mentorTopics: string[];
  canSubmit: (submissionState: boolean) => void;
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
  formattedOptions: { label: string; value: string }[];
}
const SelectToolWithOther: React.FC<SelectToolWithOtherProps> = ({
  mentorTopics,
  placeholder,
  canSubmit,
  selectedItems,
  setSelectedItems,
  formattedOptions
}) => {
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);
  // const [selectedItems, setSelectedItems] = useState<string[]>([]); // New state variable

  useEffect(() => {
    if (selectedItems.length > 0) {
      canSubmit(true);
    } else {
      canSubmit(false);
    }
  }, [selectedItems]);

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

  function handleSelection(selectedLabel: string) {
    // console.log('prevSelectedItems: ', selectedItems);
    // console.log('selectedLabel: ', selectedLabel);
    // console.log('formattedOptions: ', formattedOptions);

    setSelectedItems(prevSelectedItems => {
      const option = formattedOptions.find(
        option => option.label === selectedLabel
      );

      if (!option) {
        console.error('Option not found for label: ', selectedLabel);
        return prevSelectedItems;
      }

      const numericValue = parseInt(option.value, 10);

      if (isNaN(numericValue)) {
        console.error(
          'Invalid value for label: ',
          selectedLabel,
          'Value:',
          option.value
        );
        return prevSelectedItems;
      }

      if (!prevSelectedItems.includes(numericValue.toString())) {
        return [...prevSelectedItems, numericValue.toString()];
      } else {
        return prevSelectedItems.filter(
          item => item !== numericValue.toString()
        );
      }
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
        {selectedItems.map((value, idx) => {
          const option = formattedOptions.find(
            option => option.value === value
          );
          const label = option ? option.label : 'Unknown';

          return (
            <SkillTag
              key={idx}
              skill={label}
              color={`blue`}
              onDelete={() => removeSkill(value)}
            />
          );
        })}
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
                // onKeyDown={e => e.stopPropagation()}
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
        onSelect={handleSelection}
        options={formattedOptions
          .filter(option => !selectedItems?.includes(option?.value))
          .map(option => ({
            label: option.label,
            value: option.label
          }))}
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
      className={`p-1 rounded-lg flex gap-1 items-center border border-[#1677FF]`}
      // style={{ backgroundColor: `light${randomColor}`, color: randomColor }}
    >
      <div className="text-xs text-[#1677FF]">{skill}</div>
      <div
        onClick={onDelete}
        className="p-1 text-[10px] font-bold text-white bg-gray-300 rounded-lg hover:cursor-pointer leading-[8px]"
      >
        x
      </div>
    </div>
  );
};
