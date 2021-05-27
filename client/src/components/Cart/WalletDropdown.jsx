import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from 'react-dropdown';
import isEmpty from 'lodash/isEmpty';

import classes from './Cart.module.scss';
import 'react-dropdown/style.css';

const WalletDropdown = props => {
  const { input, options, setWallet } = props;
  const { onChange } = input;

  const sortedOptions = options.sort(
    (a, b) => b.balance - a.balance || a.name.localeCompare(b.name),
  );

  const initValue =
    (!isEmpty(sortedOptions) && sortedOptions[0]) || 'Wallet name';

  const styledOptions = sortedOptions.map(item => ({
    value: item,
    label: item.name,
    className: [classes.optionItem],
  }));

  const onDropdownChange = value => {
    const { value: itemValue } = value || {};

    onChange(itemValue);
    setWallet(itemValue);
  };

  useEffect(() => {
    if (initValue) {
      onChange(initValue);
      setWallet(initValue);
    }
  }, []);

  return (
    <Dropdown
      options={styledOptions}
      value={initValue && initValue.name}
      onChange={onDropdownChange}
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
