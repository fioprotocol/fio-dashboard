import React from 'react';

import Loader from '../Loader/Loader';

import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';
import PaymentsBlock from './components/PaymentsBlock';
import { PriceComponent } from '../PriceComponent';

import { CartItem, FioWalletDoublet, PaymentProvider } from '../../types';

import classes from './Cart.module.scss';

type Props = {
  cartItems: CartItem[];
  formsOfPayment: { [key: string]: boolean };
  isAffiliateEnabled: boolean;
  isFree: boolean;
  loading: boolean;
  paymentWalletPublicKey: string;
  hasLowBalance: boolean;
  totalCartAmount: string;
  totalCartUsdcAmount: string;
  totalCartNativeAmount: string;
  userWallets: FioWalletDoublet[];
  selectedPaymentProvider: PaymentProvider;
  disabled: boolean;
  showExpiredDomainWarningBadge: boolean;
  onPaymentChoose: (paymentProvider: PaymentProvider) => void;
};

const CartAmount: React.FC<Props> = props => {
  const {
    cartItems,
    formsOfPayment,
    hasLowBalance,
    isAffiliateEnabled,
    isFree,
    loading,
    paymentWalletPublicKey,
    totalCartAmount,
    totalCartUsdcAmount,
    totalCartNativeAmount,
    userWallets,
    selectedPaymentProvider,
    disabled,
    showExpiredDomainWarningBadge,
    onPaymentChoose,
  } = props;

  return (
    <CartSmallContainer isHintColor={true} hasBigMargin={true}>
      <h3 className={classes.amountTitle}>Amount Due</h3>
      <h5 className={classes.amountSubtitle}>Total Due</h5>
      <div className={classes.total}>
        <hr className={classes.divider} />
        <div className={classes.cost}>
          Cost:{' '}
          {loading ? (
            <Loader hasSmallSize className="justify-content-start ml-3" />
          ) : (
            <PriceComponent
              costFio={totalCartAmount}
              costUsdc={totalCartUsdcAmount}
              isFree={isFree}
            />
          )}
        </div>
        <hr className={classes.divider} />
      </div>
      <div className={classes.paymentsBlock}>
        <PaymentsBlock
          isAffiliateEnabled={isAffiliateEnabled}
          isFree={isFree}
          hasLowBalance={hasLowBalance}
          cartItems={cartItems}
          paymentWalletPublicKey={paymentWalletPublicKey}
          onPaymentChoose={onPaymentChoose}
          totalCartNativeAmount={totalCartNativeAmount}
          totalCartUsdcAmount={totalCartUsdcAmount}
          userWallets={userWallets}
          selectedPaymentProvider={selectedPaymentProvider}
          disabled={disabled}
          showExpiredDomainWarningBadge={showExpiredDomainWarningBadge}
          loading={loading}
          formsOfPayment={formsOfPayment}
        />
      </div>
    </CartSmallContainer>
  );
};

export default CartAmount;
