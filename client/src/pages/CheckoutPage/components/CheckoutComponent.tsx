import React from 'react';
import isEmpty from 'lodash/isEmpty';

import CartItem from '../../../components/Cart/CartItem';
import PriceBadge from '../../../components/Badges/PriceBadge/PriceBadge';
import { PaymentWallet } from './PaymentWallet';
import { PaymentOptionComponent } from './PaymentOptionComponent';

import { totalCost } from '../../../util/cart';

import { BADGE_TYPES } from '../../../components/Badge/Badge';
import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import { CheckoutComponentProps } from '../types';

import classes from '../CheckoutPage.module.scss';

export const CheckoutComponent: React.FC<CheckoutComponentProps> = props => {
  const { cart, roe, payment, ...rest } = props;
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
          costFio={costFio}
          costUsdc={costUsdc}
          costFree={!costNativeFio && costFree}
          title="Total Cost"
          type={BADGE_TYPES.BLACK}
        />
      </div>
      <div className={classes.details}>
        <PaymentWallet
          {...rest}
          totalCost={costNativeFio}
          includePaymentMessage={rest.paymentOption === PAYMENT_OPTIONS.FIO}
        />
      </div>
      <PaymentOptionComponent
        {...rest}
        cart={cart}
        costFree={costFree}
        totalCost={costNativeFio}
        payment={payment}
      />
    </>
  );
};
