import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button, Tag } from 'antd';
import type { InputRef } from 'antd';

let index = 0;

type CustomTagProps = {
  label: React.ReactNode;
  value: string;
  closable?: boolean;
  onClose?: (e: React.MouseEvent) => void;
  color?: string;
};

type TagRender = (props: CustomTagProps) => React.ReactNode;

const CustomDropdown: React.FC<{
  inputRef: React.RefObject<InputRef>;
  name: string;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addItem: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  children?: React.ReactNode; // Include children in the type definition
}> = ({ inputRef, name, onNameChange, addItem, children }) => (
  <>
    <Space style={{ padding: '0 8px 4px' }}>
      <Input
        placeholder="Please enter item"
        ref={inputRef}
        value={name}
        onChange={onNameChange}
        onKeyDown={(e) => e.stopPropagation()}
      />
      <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
        Add item
      </Button>
    </Space>
    <Divider style={{ margin: '8px 0' }} />
    {children}
  </>
);


const CustomHH: React.FC = () => {
  const [items, setItems] = useState(['jack', 'lucy']);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose, color } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Select
      style={{ width: 300 }}
      placeholder="custom dropdown render"
      dropdownRender={(menu) => (
        <CustomDropdown inputRef={inputRef} name={name} onNameChange={onNameChange} addItem={addItem}>
          {menu}
        </CustomDropdown>
      )}
      tagRender={tagRender}
      options={items.map((item) => ({ label: item, value: item }))}
    />
  );
};

export default CustomHH;
