import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import CartItem from '../Cart/CartItem';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { totalCost } from '../../utils';
import classes from './Purchase.module.scss';

const Purchase = props => {
  const { isCheckout, isPurchase, cart, paymentWallet } = props;

  const handleClick = () => {
    //todo: set action
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Purchase Details</h6>
        {!isEmpty(cart) &&
          cart.map(item => <CartItem item={item} key={item.id} />)}
      </div>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Payment Details</h6>
        <Badge type={BADGE_TYPES.BLACK} show>
          <div className={classnames(classes.item, classes.total)}>
            <span className="boldText">Total Cost</span>
            <p className={classes.totalPrice}>
              <span className="boldText">{totalCost(cart)}</span>
            </p>
          </div>
        </Badge>
        <Badge type={BADGE_TYPES.WHITE} show>
          <div className={classes.item}>
            <span className="boldText">Paying With</span>
            <div className={classes.wallet}>
              <p className={classes.title}>
                <span className="boldText">FIO Wallet</span>
              </p>
              <p className={classes.balance}>
                (Available Balance {paymentWallet.balance} FIO)
              </p>
            </div>
          </div>
        </Badge>
      </div>
      <Button onClick={handleClick} className={classes.button}>
        {isCheckout ? 'Purchase Now' : isPurchase ? 'Close' : ''}
      </Button>
    </div>
  );
};

export default Purchase;
