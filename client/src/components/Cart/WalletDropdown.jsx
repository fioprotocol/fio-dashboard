import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from 'react-dropdown';

import classes from './Cart.module.scss';
import 'react-dropdown/style.css';

const WalletDropdown = props => {
  const { input, options, initValue, setWallet } = props;
  const { onChange } = input;

  const styledOptions = options
    .map(item => ({
      value: item.publicAddress,
      label: item.name,
      className: [classes.optionItem],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const onDropdownChange = value => {
    const { value: itemValue } = value || {};

    onChange(itemValue);
    setWallet(itemValue);
  };

  return (
    <Dropdown
      options={styledOptions}
      value={initValue}
      onChange={onDropdownChange}
      placeholder="FIO Wallet Name"
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

export default WalletDropdown;
