import React from 'react';
import Dropdown from 'react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from './CustomDropdown.module.scss';

type Props = {
  options: { id: string; name: string }[];
  value?: string;
  placeholder?: string;
  isBigHeight?: boolean;
  isSimple?: boolean;
  onChange: (id: string) => void;
};

const CustomDropdown: React.FC<Props> = props => {
  const {
    options,
    onChange,
    placeholder,
    value,
    isBigHeight,
    isSimple,
  } = props;

  const styledOptions = options.map(option => ({
    value: option.id,
    label: option.name,
    className: classes.optionItem,
  }));
  const onDropdownChange = (value: { value: string }) => {
    const { value: itemValue } = value || {};

    onChange(itemValue);
  };

  return (
    <Dropdown
      options={styledOptions}
      value={value ? value : null}
      onChange={onDropdownChange}
      placeholder={placeholder}
      className={classes.dropdown}
      controlClassName={classnames(
        classes.control,
        isSimple && classes.isSimple,
        isBigHeight && classes.isBigHeight,
      )}
      placeholderClassName={classes.placeholder}
      menuClassName={classes.menu}
      arrowClosed={
        <FontAwesomeIcon icon="chevron-down" className={classes.icon} />
      }
      arrowOpen={<FontAwesomeIcon icon="chevron-up" className={classes.icon} />}
    />
  );
};

export default CustomDropdown;
