import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import PurchaseNow from '../PurchaseNow';
import { ROUTES } from '../../constants/routes';
import Processing from './Processing';

import classes from './CheckoutPurchaseContainer.module.scss';

const CheckoutPurchaseContainer = props => {
  const {
    isCheckout,
    isPurchase,
    setRegistration,
    history,
    children,
    registrationResult,
  } = props;
  const [isProcessing, setProcessing] = useState(false);

  const hasErrors = !isEmpty(registrationResult.errors || []);

  const onClose = () => {
    setRegistration({});
    history.push(ROUTES.DASHBOARD);
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
        <PurchaseNow
          onFinish={onFinish}
          setProcessing={setProcessing}
          isRetry={isPurchase && hasErrors}
        />
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
