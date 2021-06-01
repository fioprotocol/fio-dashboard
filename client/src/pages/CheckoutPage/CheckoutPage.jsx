import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import Purchase from '../../components/Purchase';
import '../../helpers/gt-sdk';
import { ROUTES } from '../../constants/routes';

const CheckoutPage = props => {
  const {
    fioWallets,
    refreshBalance,
    cartItems,
    history,
    paymentWalletId,
    isAuthenticated,
  } = props;

  useEffect(() => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        refreshBalance(fioWallet.publicKey);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES);
    }
  }, [isAuthenticated]);

  const currentWallet =
    paymentWalletId &&
    !isEmpty(fioWallets) &&
    fioWallets.find(item => item.id === paymentWalletId);

  const isFree =
    !isEmpty(cartItems) &&
    cartItems.length === 1 &&
    cartItems.every(item => !item.costFio && !item.costUsdc);

  const onClose = () => {
    history.push(ROUTES.CART);
  };

  return (
    <PseudoModalContainer title="Make Purchase" onClose={onClose}>
      <Purchase
        cart={cartItems}
        currentWallet={currentWallet}
        isFree={isFree}
        isCheckout
      />
    </PseudoModalContainer>
  );
};

export default CheckoutPage;
