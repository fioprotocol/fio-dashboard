import React from 'react';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import { CheckoutComponent } from './components/CheckoutComponent';
import Processing from '../../components/common/TransactionProcessing';
import Loader from '../../components/Loader/Loader';
import BeforeSubmitWalletConfirm from './components/BeforeSubmitWalletConfirm';

import { useContext } from './CheckoutPageContext';

// Loads captcha files, DO NOT REMOVE
import '../../helpers/gt-sdk';

import classes from '../PurchasePage/styles/PurchasePage.module.scss';

export const CheckoutPage: React.FC = () => {
  const {
    cartItems,
    isProcessing,
    payment,
    paymentWallet,
    title,
    walletBalancesAvailable,
    beforeSubmitProps,
    onClose,
    setProcessing,
    ...rest
  } = useContext();

  if (!payment) return <Loader />;

  return (
    <PseudoModalContainer title={title} onClose={onClose}>
      <div className={classes.container}>
        <CheckoutComponent
          walletBalances={walletBalancesAvailable}
          walletName={paymentWallet ? paymentWallet.name : ''}
          payment={payment}
          cart={cartItems}
          {...rest}
        />
      </div>
      {beforeSubmitProps && (
        <BeforeSubmitWalletConfirm
          {...beforeSubmitProps}
          setProcessing={setProcessing}
          processing={isProcessing}
        />
      )}
      <Processing isProcessing={isProcessing} />
    </PseudoModalContainer>
  );
};
