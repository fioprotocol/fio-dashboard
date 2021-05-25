import React, { useEffect, useState } from 'react';
import { executeRegistration } from './middleware';

export const Register = props => {
  const {
    cartItems,
    pinConfirmation,
    captchaResult,
    paymentWallet,
    showPinModal,
    checkCaptcha,
    recordFreeAddress,
  } = props;
  const [isWaiting, setWaiting] = useState(false);

  // registration
  useEffect(async () => {
    const { keys } = pinConfirmation;
    if (keys && keys[paymentWallet.id] && isWaiting) {
      const results = await executeRegistration(
        cartItems,
        keys[paymentWallet.id],
      );
      // todo: handle results
    }

    setWaiting(false);
  }, [pinConfirmation]);

  useEffect(async () => {
    const { success } = captchaResult;
    if (success && isWaiting) {
      const results = await executeRegistration(cartItems, {
        public: paymentWallet.publicKey,
      });
      // todo: handle results

      for (const item of results.registered) {
        if (item.isFree) {
          recordFreeAddress(item.fioName);
        }
      }
    }
    setWaiting(false);
  }, [captchaResult]);

  const purchase = async () => {
    setWaiting(true);
    for (const item of cartItems) {
      if (item.costFio) {
        return showPinModal();
      }
    }
    checkCaptcha();
  };

  return (
    <button type="submit" onClick={purchase}>
      Purchase Now
    </button>
  );
};
