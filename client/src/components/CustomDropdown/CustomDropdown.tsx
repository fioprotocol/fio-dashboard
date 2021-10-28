import React from 'react';
import Dropdown from 'react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './CustomDropdown.module.scss';

type Props = {
  options: { id: string; name: string }[];
  placeholder?: string;
  hasDefaultValue?: boolean;
  onChange: (id: string) => void;
};

const CustomDropdown: React.FC<Props> = props => {
  const { options, onChange, placeholder, hasDefaultValue } = props;

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
      value={hasDefaultValue ? styledOptions[0] : null}
      onChange={onDropdownChange}
      placeholder={placeholder}
      className={classes.dropdown}
      controlClassName={classes.control}
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
