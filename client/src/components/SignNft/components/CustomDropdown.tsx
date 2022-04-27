import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from 'react-dropdown';

import classes from '../SignNft.module.scss';
import 'react-dropdown/style.css';

type Props = {
  value: string;
  list: string[];
  onChange: (value: string) => void;
};

const CustomDropdown: React.FC<Props> = props => {
  const { value, list, onChange } = props;

  if (list.length === 1) return <div>{list[0]}</div>;

  const options = list.map(item => ({
    value: item,
    label: item,
  }));

  const onDropdownChange = (selected: { value: string }) => {
    onChange(selected.value);
  };

  return (
    <Dropdown
      options={options}
      value={value}
      onChange={onDropdownChange}
      className={classes.dropdown}
      controlClassName={classes.control}
      menuClassName={classes.menu}
      arrowClosed={
        <FontAwesomeIcon
          icon="chevron-down"
          className={classes.dropdownArrow}
        />
      }
      arrowOpen={
        <FontAwesomeIcon icon="chevron-up" className={classes.dropdownArrow} />
      }
    />
  );
};

export default CustomDropdown;
