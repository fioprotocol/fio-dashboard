import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from 'react-dropdown';

import classes from './AddressDomainForm.module.scss';
import 'react-dropdown/style.css';

const CUSTOM_DOMAIN_VALUE = 'addCustomDomain';

const CustomDropdown = props => {
  const {
    toggle,
    input,
    options,
    initValue,
    allowCustomDomains = false,
  } = props;
  const { onChange } = input;

  const styledOptions = options
    .map(item => ({
      value: item,
      label: item,
      className: [classes.optionItem],
    }))
    .sort((a, b) => a.value.localeCompare(b.value));

  if (allowCustomDomains) {
    styledOptions.push({
      value: CUSTOM_DOMAIN_VALUE,
      label: 'Add Custom Domain',
      className: [classes.optionButton],
    });
  }

  const onDropdownChange = value => {
    const { value: itemValue } = value || {};
    if (itemValue === CUSTOM_DOMAIN_VALUE) {
      onChange('');
      return toggle(true);
    }

    onChange(itemValue);
  };

  return (
    <Dropdown
      options={styledOptions}
      value={initValue}
      onChange={onDropdownChange}
      placeholder="Select Domain"
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
