import React from 'react';

import CustomDropdown from '../../../components/CustomDropdown';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';

import { useContext } from './FioWalletSnapComponentContext';

import { FIO_ACTIONS_OBJECT_LIST } from './constants';

import classes from './FioWalletSnapComponent.module.scss';

export const FioWalletSnapComponent: React.FC = () => {
  const { onConnectClick, onActionChange, onSignTxn } = useContext();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <div className={classes.logo} />
        </div>
      </div>
      <div className={classes.contentContainer}>
        <h3 className={classes.title}>FIO Wallet Snap test page</h3>
        <SubmitButton
          onClick={onConnectClick}
          text="Connect MetaMask"
          withBottomMargin
        />
        <div className={classes.dropdown}>
          <CustomDropdown
            options={FIO_ACTIONS_OBJECT_LIST}
            onChange={onActionChange}
          />
        </div>
        <div>
          <h5>Signed transaction</h5>
        </div>
        <SubmitButton onClick={onSignTxn} text="Execute Transaction" />
        <div>
          <h5>Transaction details</h5>
        </div>
      </div>
      <section className={classes.footer}>
        <div className={classes.logoLink}>
          <div className={classes.logo} />
        </div>
      </section>
    </div>
  );
};
