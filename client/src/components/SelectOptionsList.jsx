import React from 'react';
import { Select } from 'antd';

export default function selectOptionsList({ list, ...rest }) {
  return list.map(option => (
    <Select.Option key={option} {...rest}>
      {option}
    </Select.Option>
  ));
}
