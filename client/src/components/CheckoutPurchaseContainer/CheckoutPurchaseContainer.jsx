import React from 'react';
import { Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import PurchaseNow from '../PurchaseNow';
import { ROUTES } from '../../constants/routes';
import Processing from '../common/TransactionProcessing';

import classes from './CheckoutPurchaseContainer.module.scss';

const CheckoutPurchaseContainer = props => {
  const {
    isCheckout,
    isPurchase,
    isProcessing,
    setProcessing,
    setRegistration,
    history,
    children,
    registrationResult,
  } = props;

  const hasErrors = !isEmpty(registrationResult.errors || []);

  const onClose = () => {
    setRegistration({});
    history.push(ROUTES.HOME);
  };

  const onFinish = results => {
    setRegistration(results);

    setProcessing(false);
    isCheckout && history.push(ROUTES.PURCHASE);
  };

  return (
    <div className={classes.container}>
      {children}
      {isCheckout || (isPurchase && hasErrors) ? (
        <PurchaseNow onFinish={onFinish} isRetry={isPurchase && hasErrors} />
      ) : (
        <Button onClick={onClose} className={classes.button}>
          Close
        </Button>
      )}
      <Processing isProcessing={isProcessing} />
    </div>
  );
};

export default CheckoutPurchaseContainer;
