import React from 'react';
import { Select, Tag } from 'antd';
import type { SelectProps } from 'antd';
import { MentorTopics } from '@/types/types';

type TagRender = SelectProps['tagRender'];

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const mentorTopicsOptions = Object.keys(MentorTopics)
  .sort() // Sort alphabetically
  .map(key => ({
    value: MentorTopics[key as keyof typeof MentorTopics],
    label: key.replace(/_/g, ' '),
    color: getRandomColor(),
  }));
  
const tagRender: TagRender = (props) => {
  const { label, value, closable, onClose, color,backgroundColor } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3,color:color,backgroundColor:backgroundColor }}
    >
      {label}
    </Tag>
  );
};

const App: React.FC = () => (
  <Select
    mode="multiple"
    tagRender={tagRender}
    defaultValue={['1', '2']} // Set default values based on enum keys
    style={{ width: '100%' }}
    options={mentorTopicsOptions}
  />
);

export default App;
