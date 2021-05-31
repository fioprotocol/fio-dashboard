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
    paymentWallet,
  } = props;
  useEffect(() => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        refreshBalance(fioWallet.publicKey);
      }
    }
  }, []);
  const currentWallet =
    paymentWallet &&
    !isEmpty(fioWallets) &&
    fioWallets.find(item => item.id === paymentWallet);

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
        paymentWallet={currentWallet}
        isFree={isFree}
        isCheckout
      />
    </PseudoModalContainer>
  );
};

export default CheckoutPage;
