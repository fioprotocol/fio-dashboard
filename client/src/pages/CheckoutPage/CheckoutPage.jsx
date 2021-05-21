import React, { useEffect } from 'react';

const CheckoutPage = props => {
  const { fioWallets, refreshBalance } = props;
  useEffect(() => {
    for (const fioWallet of fioWallets) {
      refreshBalance(fioWallet.publicKey);
    }
  }, []);
  return (
    <div>
      <h2>Checkout</h2>
      {fioWallets.map(fioWallet => (
        <div key={fioWallet.id}>
          {fioWallet.name}: <i>{fioWallet.balance}</i>
        </div>
      ))}
    </div>
  );
};

export default CheckoutPage;
