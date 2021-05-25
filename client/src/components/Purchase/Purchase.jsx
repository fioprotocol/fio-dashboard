import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';

import CartItem from '../Cart/CartItem';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import { totalCost } from '../../utils';
import { ROUTES } from '../../constants/routes';
import classes from './Purchase.module.scss';

const Purchase = props => {
  const { isCheckout, isPurchase, cart, paymentWallet, history } = props;

  const handleClick = () => {
    if (isCheckout) {
      history.push(ROUTES.PURCHASE);
    }

    if (isPurchase) {
      history.push(ROUTES.DASHBOARD);
    }
    //todo: set action
  };

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  const { costFio, costUsdc } = totalCost(cart);

  const walletBalance = () => {
    const wallet = paymentWallet.balance || 0;
    let walletUsdc = 0;
    if (wallet > 0) {
      walletUsdc = (wallet * costUsdc) / costFio;
    }
    return `${wallet && wallet.toFixed(2)} FIO / ${walletUsdc &&
      walletUsdc.toFixed(2)} USDC`;
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
              <span className="boldText">
                {costFio} FIO / {costUsdc} USDC
              </span>
            </p>
          </div>
        </Badge>
        {isCheckout && (
          <>
            {!isDesktop && (
              <h6
                className={classnames(classes.subtitle, classes.paymentTitle)}
              >
                Paying With
              </h6>
            )}
            <Badge type={BADGE_TYPES.WHITE} show>
              <div className={classes.item}>
                {isDesktop && (
                  <span className={classnames('boldText', classes.title)}>
                    Paying With
                  </span>
                )}
                <div className={classes.wallet}>
                  <p className={classes.title}>
                    <span className="boldText">FIO Wallet</span>
                  </p>
                  <p className={classes.balance}>
                    (Available Balance {walletBalance()})
                  </p>
                </div>
              </div>
            </Badge>
          </>
        )}
      </div>
      <Button onClick={handleClick} className={classes.button}>
        {isCheckout ? 'Purchase Now' : isPurchase ? 'Close' : ''}
      </Button>
    </div>
  );
};

export default withRouter(Purchase);
