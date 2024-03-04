import React from 'react';
import { Redirect } from 'react-router';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import { CheckoutComponent } from './components/CheckoutComponent';
import Processing from '../../components/common/TransactionProcessing';
import BeforeSubmitWalletConfirm from './components/BeforeSubmitWalletConfirm';
import CancelButton from '../../components/common/CancelButton/CancelButton';
import InfoBadge from '../../components/InfoBadge/InfoBadge';

import { useContext } from './CheckoutPageContext';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { WALLET_CREATED_FROM } from '../../constants/common';

import classes from './CheckoutPage.module.scss';

const CheckoutPage: React.FC = () => {
  const {
    cartItems,
    isLoading,
    isProcessing,
    payment,
    paymentWallet,
    paymentProvider,
    title,
    walletBalancesAvailable,
    beforeSubmitProps,
    fioLoading,
    orderLoading,
    paymentWalletPublicKey,
    orderError,
    onClose,
    setProcessing,
    ...rest
  } = useContext();

  if (orderError && !isLoading)
    return (
      <PseudoModalContainer title={title} onClose={onClose}>
        <InfoBadge
          message="Something went wrong, Please try again."
          show={!!orderError}
          title=""
          type={BADGE_TYPES.ERROR}
        />
        <div className="d-flex justify-content-center">
          <CancelButton
            onClick={onClose}
            text="Back"
            withTopMargin={true}
            isBlack={true}
          />
        </div>
      </PseudoModalContainer>
    );

  if (!payment && !fioLoading && !orderLoading)
    return <Redirect to={ROUTES.FIO_ADDRESSES_SELECTION} />;

  return (
    <PseudoModalContainer title={title} onClose={onClose}>
      <div className={classes.container}>
        <CheckoutComponent
          walletBalances={walletBalancesAvailable}
          walletName={paymentWallet ? paymentWallet.name : ''}
          payment={payment}
          paymentProvider={paymentProvider}
          paymentWalletPublicKey={paymentWalletPublicKey}
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
      {paymentWallet?.from === WALLET_CREATED_FROM.METAMASK ? null : (
        <Processing isProcessing={isProcessing} />
      )}
    </PseudoModalContainer>
  );
};

export default CheckoutPage;
