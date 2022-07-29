import React from 'react';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import { CheckoutComponent } from './components/CheckoutComponent';
import Processing from '../../components/common/TransactionProcessing';
import Loader from '../../components/Loader/Loader';

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
    onClose,
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
      <Processing isProcessing={isProcessing} />
    </PseudoModalContainer>
  );
};
