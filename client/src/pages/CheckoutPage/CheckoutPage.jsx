import React, { useEffect } from 'react';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import Purchase from '../../components/Purchase/Purchase';
import Register from '../../components/Register';
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
    for (const fioWallet of fioWallets) {
      refreshBalance(fioWallet.publicKey);
    }
  }, []);

  const onClose = () => {
    history.push(ROUTES.CART);
  };

  return (
    <PseudoModalContainer title="Make Purchase" onClose={onClose}>
      <Purchase cart={cartItems} paymentWallet={paymentWallet} isCheckout />
      <Register />
    </PseudoModalContainer>
  );
};

export default CheckoutPage;
