import React from 'react';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import { CheckoutComponent } from './components/CheckoutComponent';
import Processing from '../../components/common/TransactionProcessing';

import { useContext } from './CheckoutPageContext';

// Loads captcha files, DO NOT REMOVE
import '../../helpers/gt-sdk';

import classes from '../PurchasePage/styles/PurchasePage.module.scss';

export const CheckoutPage: React.FC = () => {
  const {
    cartItems,
    walletBalancesAvailable,
    paymentWallet,
    paymentWalletPublicKey,
    roe,
    fioWallets,
    fioWalletsBalances,
    isProcessing,
    title,
    paymentOption,
    isFree,
    onClose,
    onFinish,
    setWallet,
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
          fioWalletsBalances={fioWalletsBalances}
          paymentOption={paymentOption}
          isFree={isFree}
          onFinish={onFinish}
          setWallet={setWallet}
        />
      </div>
      <Processing isProcessing={isProcessing} />
    </PseudoModalContainer>
  );
};
