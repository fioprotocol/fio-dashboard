import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldRenderProps } from 'react-final-form';
import Dropdown from 'react-dropdown';
import isEmpty from 'lodash/isEmpty';

import useEffectOnce from '../../hooks/general';

import { FioWalletDoublet } from '../../types';

import classes from './Cart.module.scss';
import 'react-dropdown/style.css';

type Props = {
  input: { onChange: (walletPublicKey: string) => void };
  options: FioWalletDoublet[];
  setWallet: (publicKey: string) => void;
};

const WalletDropdown: React.FC<Props & FieldRenderProps<Props>> = (
  props: Props,
) => {
  const { input, options, setWallet } = props;
  const { onChange } = input;

  const sortedOptions = options.sort(
    (a, b) => b.balance - a.balance || a.name.localeCompare(b.name),
  );

  const initValue: string =
    (!isEmpty(sortedOptions) && sortedOptions[0].publicKey) || '';

  const styledOptions = sortedOptions.map(item => ({
    value: item.publicKey,
    label: item.name,
    className: `${classes.optionItem}`,
  }));

  const onDropdownChange = (value: { value: string }) => {
    const { value: itemValue } = value || {};

    onChange(itemValue);
    setWallet(itemValue);
  };

  useEffectOnce(() => {
    if (initValue) {
      onChange(initValue);
      setWallet(initValue);
    }
  }, [initValue, onChange, setWallet]);

  return (
    <Dropdown
      options={styledOptions}
      value={initValue}
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
