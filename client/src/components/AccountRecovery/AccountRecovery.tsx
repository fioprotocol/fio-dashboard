import React, { useCallback, useEffect } from 'react';
import { RouterProps } from 'react-router';

import FormModalWrapper from '../FormModalWrapper/FormModalWrapper';
import { ROUTES } from '../../constants/routes';
import CloseButton from '../CloseButton/CloseButton';

import AccountRecoveryForm from './AccountRecoveryForm';
import { AccountRecoveryTypes } from './types';

import classes from './AccountRecovery.module.scss';

const AccountRecovery: React.FC<AccountRecoveryTypes & RouterProps> = props => {
  const {
    history,
    recoveryAccountResults,
    showLoginModal,
    clearRecoveryResults,
  } = props;
  const onClose = useCallback(() => {
    history.push(ROUTES.HOME);
    clearRecoveryResults();
  }, [clearRecoveryResults, history]);

  useEffect(() => {
    if (recoveryAccountResults.status) {
      onClose();
      showLoginModal();
    }
  }, [onClose, recoveryAccountResults, showLoginModal]);

  return (
    <div className={classes.container}>
      <FormModalWrapper>
        <div className={classes.formContainer}>
          <div className={classes.closeButton}>
            <CloseButton handleClick={onClose} isWhite={true} />
          </div>
          <h4 className={classes.title}>Recover Account</h4>
          <AccountRecoveryForm {...props} cancelAction={onClose} />
        </div>
      </FormModalWrapper>
    </div>
  );
};

export default AccountRecovery;
