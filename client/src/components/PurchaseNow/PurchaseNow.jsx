import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import classes from '../Purchase/Purchase.module.scss';
import { executeRegistration } from './middleware';

export const PurchaseNow = props => {
  const {
    cartItems,
    pinConfirmation,
    captchaResult,
    paymentWallet,
    showPinModal,
    checkCaptcha,
    recordFreeAddress,
    confirmingPin,
    captchaResolving,
    onFinish,
  } = props;
  const [isWaiting, setWaiting] = useState(false);

  const loading = confirmingPin || captchaResolving;

  // registration
  useEffect(async () => {
    const { keys, error } = pinConfirmation;
    if (keys && keys[paymentWallet.id] && isWaiting) {
      const results = await executeRegistration(
        cartItems,
        keys[paymentWallet.id],
      );
      onFinish(results);

      setWaiting(false);
    }

    if (error) setWaiting(false);
  }, [pinConfirmation]);

  useEffect(async () => {
    const { success, verifyParams } = captchaResult;

    if (success && isWaiting) {
      const results = await executeRegistration(
        cartItems,
        {
          public: paymentWallet.publicKey,
        },
        verifyParams,
      );
      onFinish(results);

      for (const item of results.registered) {
        recordFreeAddress(item.fioName);
      }

      setWaiting(false);
    }

    if (success === false) setWaiting(false);
  }, [captchaResult]);

  const purchase = () => {
    setWaiting(true);
    for (const item of cartItems) {
      if (item.costFio) {
        return showPinModal();
      }
    }
    checkCaptcha();
  };

  return (
    <Button onClick={purchase} className={classes.button} disabled={loading}>
      Purchase Now
    </Button>
  );
};
