import React, { useEffect } from 'react';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import Purchase from '../../components/Purchase/Purchase';
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
      {/* {fioWallets.map((fioWallet) => (
        <div key={fioWallet.id}>
          {fioWallet.name}: <i>{fioWallet.balance}</i>
        </div>
      ))} */}
    </PseudoModalContainer>
  );
};

export default CheckoutPage;
