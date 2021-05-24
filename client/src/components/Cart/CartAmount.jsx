import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { ROUTES } from '../../constants/routes';
import colors from '../../assets/styles/colorsToJs.module.scss';
import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';

import { totalCost } from '../../utils';
import classes from './Cart.module.scss';

const CartAmount = props => {
  const { cartItems, history } = props;

  const handleCheckout = () => {
    history.push(ROUTES.CHECKOUT);
  };

  return (
    <CartSmallContainer bgColor={colors.hint}>
      <h3 className={classes.amountTitle}>Amount Due</h3>
      <h5 className={classes.amountSubtitle}>Total Due</h5>
      <div className={classes.total}>
        <hr className={classes.divider} />
        <p className={classes.cost}>
          Cost: {totalCost(cartItems)}{' '}
          <span className={classes.light}>(annually)</span>
        </p>
        <hr className={classes.divider} />
      </div>
      <Button className={classes.checkout} onClick={handleCheckout}>
        <FontAwesomeIcon icon="wallet" className={classes.icon} />
        <p>Pay with FIO</p>
      </Button>
    </CartSmallContainer>
  );
};

export default CartAmount;
