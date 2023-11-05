import React from 'react';

import Loader from '../Loader/Loader';

import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';
import PaymentsBlock from './components/PaymentsBlock';
import { PriceComponent } from '../PriceComponent';

import { CartItem, FioWalletDoublet, PaymentProvider } from '../../types';

import classes from './Cart.module.scss';

type Props = {
  cartItems: CartItem[];
  isFree: boolean;
  loading: boolean;
  paymentWalletPublicKey: string;
  hasLowBalance: boolean;
  totalCartAmount: string;
  totalCartUsdcAmount: string;
  totalCartNativeAmount: number;
  userWallets: FioWalletDoublet[];
  selectedPaymentProvider: PaymentProvider;
  disabled: boolean;
  error: string | null;
  showExpiredDomainWarningBadge: boolean;
  onPaymentChoose: (paymentProvider: PaymentProvider) => void;
};

const CartAmount: React.FC<Props> = props => {
  const {
    cartItems,
    hasLowBalance,
    isFree,
    loading,
    paymentWalletPublicKey,
    totalCartAmount,
    totalCartUsdcAmount,
    totalCartNativeAmount,
    userWallets,
    selectedPaymentProvider,
    disabled,
    error,
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
          isFree={isFree}
          hasLowBalance={hasLowBalance}
          cartItems={cartItems}
          paymentWalletPublicKey={paymentWalletPublicKey}
          onPaymentChoose={onPaymentChoose}
          totalCartNativeAmount={totalCartNativeAmount}
          totlaCartUsdcAmount={totalCartUsdcAmount}
          userWallets={userWallets}
          selectedPaymentProvider={selectedPaymentProvider}
          disabled={!!error || disabled}
          showExpiredDomainWarningBadge={showExpiredDomainWarningBadge}
        />
      </div>
    </CartSmallContainer>
  );
};

export default CartAmount;
