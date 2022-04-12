import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';

import { totalCost } from '../../utils';

import { CartItem as CartItemType } from '../../types';

import classes from './Cart.module.scss';

type Props = {
  cartItems: CartItemType[];
  isFree: boolean;
  paymentWalletPublicKey: string;
  recalculateBalance: () => void;
  hasLowBalance: boolean;
  roe: number;
};

const CartAmount: React.FC<Props> = props => {
  const {
    cartItems,
    hasLowBalance,
    isFree,
    paymentWalletPublicKey,
    recalculateBalance,
    roe,
  } = props;

  const handleCheckout = () => {
    recalculateBalance();
  };

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
      <Button
        className={classes.checkout}
        onClick={handleCheckout}
        disabled={
          hasLowBalance ||
          paymentWalletPublicKey === '' ||
          cartItems.length === 0
        }
      >
        <FontAwesomeIcon icon="wallet" className={classes.icon} />
        <p>{isFree ? 'Complete Transaction' : 'Pay with FIO'}</p>
      </Button>
    </CartSmallContainer>
  );
};

export default CartAmount;
