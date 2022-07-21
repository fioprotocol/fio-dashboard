import React from 'react';
import isEmpty from 'lodash/isEmpty';

import CartItem from '../../../components/Cart/CartItem';
import PriceBadge from '../../../components/Badges/PriceBadge/PriceBadge';
import { BADGE_TYPES } from '../../../components/Badge/Badge';

import { PaymentOptionComponent } from './PaymentOptionComponent';

import { totalCost } from '../../../utils';

import { CheckoutComponentProps } from '../types';

import classes from '../../PurchasePage/styles/PurchasePage.module.scss';

export const CheckoutComponent: React.FC<CheckoutComponentProps> = props => {
  const { cart, roe, ...rest } = props;
  const { costNativeFio, costFree, costFio, costUsdc } = totalCost(cart, roe);

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Purchase Details</h6>
        {!isEmpty(cart) &&
          cart.map(item => <CartItem item={item} key={item.id} />)}
      </div>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Payment Details</h6>
        <PriceBadge
          paymentAmount={costFio}
          convertedPaymentAmount={costUsdc}
          costFree={!costNativeFio && costFree}
          title="Total Cost"
          type={BADGE_TYPES.BLACK}
        />
      </div>
      <PaymentOptionComponent {...rest} cart={cart} costFree={costFree} />
    </>
  );
};
