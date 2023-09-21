import React from 'react';
import Dropdown from 'react-dropdown';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
      arrowClosed={<ExpandMoreIcon className={classes.dropdownArrow} />}
      arrowOpen={<ExpandLessIcon className={classes.dropdownArrow} />}
    />
  );
};

export default CustomDropdown;
