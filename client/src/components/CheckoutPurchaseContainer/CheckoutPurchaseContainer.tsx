import React from 'react';
import { Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import { History } from 'history';

import PurchaseNow from '../PurchaseNow';
import Processing from '../common/TransactionProcessing';

import { ROUTES } from '../../constants/routes';
import { ERROR_TYPES } from '../../constants/errors';
import { CONTAINED_FLOW_ACTIONS } from '../../constants/containedFlow';

import { RegistrationResult, FioActionExecuted } from '../../types';

import classes from './CheckoutPurchaseContainer.module.scss';

type Props = {
  isCheckout: boolean;
  isPurchase: boolean;
  isProcessing: boolean;
  setProcessing: (processing: boolean) => void;
  setRegistration: (results: RegistrationResult) => void;
  history: History;
  children: React.ReactNode | React.ReactNode[];
  registrationResult: RegistrationResult;
  closeText: () => void;
  onClose: () => void;
  fioActionExecuted: (data: FioActionExecuted) => void;
};

const CheckoutPurchaseContainer: React.FC<Props> = props => {
  const {
    isCheckout,
    isPurchase,
    isProcessing,
    setProcessing,
    setRegistration,
    history,
    children,
    registrationResult,
    closeText,
    onClose: parentOnClose,
    fioActionExecuted,
  } = props;

  const errors = registrationResult.errors || [];
  const isRetry =
    isPurchase &&
    !isEmpty(
      errors.filter(
        ({ errorType }) => errorType !== ERROR_TYPES.freeAddressIsNotRegistered,
      ),
    );

  const onClose = () => {
    setRegistration({
      errors: [],
      registered: [],
      partial: [],
    });
    if (parentOnClose) {
      return parentOnClose();
    }
    history.push(ROUTES.HOME);
  };

  const onFinish = (results: RegistrationResult) => {
    setRegistration(results);

    setProcessing(false);
    if (!isRetry) {
      const txIds: string[] = [];
      results.registered.forEach(regAddress => {
        const { transactions } = regAddress;
        if (transactions?.length > 0) {
          txIds.push(...transactions);
        }
      });

      fioActionExecuted({
        result: { status: 1, txIds },
        executeActionType: CONTAINED_FLOW_ACTIONS.REG,
      });
    }
    isCheckout && history.push(ROUTES.PURCHASE);
  };

  return (
    <div className={classes.container}>
      {children}
      {isCheckout || isRetry ? (
        <PurchaseNow onFinish={onFinish} isRetry={isRetry} />
      ) : (
        <Button onClick={onClose} className={classes.button}>
          {closeText ? closeText : 'Close'}
        </Button>
      )}
      <Processing isProcessing={isProcessing} />
    </div>
  );
};

export default CheckoutPurchaseContainer;
