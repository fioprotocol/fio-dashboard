import React from 'react';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import { CheckoutComponent } from './components/CheckoutComponent';
import Processing from '../../components/common/TransactionProcessing';
import PurchaseNow from '../../components/PurchaseNow';

import { useContext } from './CheckoutPageContext';

import classes from '../PurchasePage/styles/PurchasePage.module.scss';

export const CheckoutPage: React.FC = () => {
  const {
    cartItems,
    walletBalancesAvailable,
    paymentWallet,
    paymentWalletPublicKey,
    roe,
    fioWallets,
    setWallet,
    fioWalletsBalances,
    isProcessing,
    title,
    onClose,
    onFinish,
  } = useContext();

  return (
    <PseudoModalContainer title={title} onClose={onClose}>
      <div className={classes.container}>
        <CheckoutComponent
          cart={cartItems}
          walletBalances={walletBalancesAvailable}
          walletName={paymentWallet ? paymentWallet.name : ''}
          paymentWalletPublicKey={paymentWalletPublicKey}
          roe={roe}
          fioWallets={fioWallets}
          setWallet={setWallet}
          fioWalletsBalances={fioWalletsBalances}
        />
        <PurchaseNow onFinish={onFinish} />
      </div>
      <Processing isProcessing={isProcessing} />
    </PseudoModalContainer>
  );
};
