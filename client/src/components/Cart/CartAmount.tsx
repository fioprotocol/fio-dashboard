import React from 'react';

import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';
import PaymentsBlock from './components/PaymentsBlock';

import { totalCost } from '../../utils';

import { CartItem, FioWalletDoublet, PaymentProvider } from '../../types';

import classes from './Cart.module.scss';

type Props = {
  cartItems: CartItem[];
  isFree: boolean;
  paymentWalletPublicKey: string;
  hasLowBalance: boolean;
  roe: number;
  totalCartNativeAmount: number;
  userWallets: FioWalletDoublet[];
  selectedPaymentProvider: PaymentProvider;
  disabled: boolean;
  error: string | null;
  onPaymentChoose: (paymentProvider: PaymentProvider) => void;
};

const CartAmount: React.FC<Props> = props => {
  const {
    cartItems,
    hasLowBalance,
    isFree,
    paymentWalletPublicKey,
    roe,
    totalCartNativeAmount,
    userWallets,
    selectedPaymentProvider,
    disabled,
    error,
    onPaymentChoose,
  } = props;

  const { costFio, costUsdc } = totalCost(cartItems, roe);

  const showAnnually = cartItems.length
    ? cartItems.every(item => !item.address)
    : false;

  return (
    <CartSmallContainer isHintColor={true} hasBigMargin={true}>
      <h3 className={classes.amountTitle}>Amount Due</h3>
      <h5 className={classes.amountSubtitle}>Total Due</h5>
      <div className={classes.total}>
        <hr className={classes.divider} />
        <p className={classes.cost}>
          Cost: {isFree ? 'FREE' : `${costFio} FIO / ${costUsdc} USDC`}{' '}
          {showAnnually && <span className={classes.light}>(annually)</span>}
        </p>
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
          userWallets={userWallets}
          selectedPaymentProvider={selectedPaymentProvider}
          disabled={!!error || disabled}
        />
      </div>
    </CartSmallContainer>
  );
};

export default CartAmount;
