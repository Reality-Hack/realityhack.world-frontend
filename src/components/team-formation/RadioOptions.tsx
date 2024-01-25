import React from 'react';
import { Radio } from 'antd';

const RadioGroup = Radio.Group;

const MyRadioButtonGroup = () => {
  const options = [
    { label: ' 1', value: '1' },
    { label: ' 2', value: '2' },
    { label: ' 3', value: '3' },
    { label: ' 4', value: '4' },
    { label: ' 5', value: '5' },
  ];

  return (
    <RadioGroup>
      {options.map(option => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default MyRadioButtonGroup;
