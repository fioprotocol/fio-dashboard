import React from 'react';
import isEmpty from 'lodash/isEmpty';

import CartItem from '../../../components/Cart/CartItem';
import PriceBadge from '../../../components/Badges/PriceBadge/PriceBadge';
import { PaymentWallet } from './PaymentWallet';
import { PaymentOptionComponent } from './PaymentOptionComponent';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';

import { totalCost } from '../../../utils';

import { BADGE_TYPES } from '../../../components/Badge/Badge';
import { CURRENCY_CODES } from '../../../constants/common';
import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import { CheckoutComponentProps } from '../types';
import { PaymentCurrency } from '../../../types';

import classes from '../../PurchasePage/styles/PurchasePage.module.scss';

export const CheckoutComponent: React.FC<CheckoutComponentProps> = props => {
  const { cart, roe, payment, ...rest } = props;
  const { costNativeFio, costFree, costFio, costUsdc } = totalCost(cart, roe);

  let paymentAmount = costFio;
  let convertedPaymentAmount = costUsdc;
  let paymentCurrency: PaymentCurrency = CURRENCY_CODES.FIO;
  let convertedPaymentCurrency: PaymentCurrency = CURRENCY_CODES.USDC;

  if (payment?.currency) {
    paymentAmount = costUsdc;
    convertedPaymentAmount = costFio;
    paymentCurrency = payment.currency;
    convertedPaymentCurrency = CURRENCY_CODES.FIO;
  }

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Purchase Details</h6>
        {!isEmpty(cart) &&
          cart.map(item => (
            <CartItem
              item={item}
              key={item.id}
              primaryCurrency={payment?.currency}
            />
          ))}
      </div>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Payment Details</h6>
        <PriceBadge
          paymentAmount={paymentAmount}
          paymentCurrency={paymentCurrency}
          convertedPaymentAmount={convertedPaymentAmount}
          convertedPaymentCurrency={convertedPaymentCurrency}
          costFree={!costNativeFio && costFree}
          title="Total Cost"
          type={BADGE_TYPES.BLACK}
        />
      </div>
      <InfoBadge
        message={rest.error}
        show={!!rest.error}
        title=""
        type={BADGE_TYPES.ERROR}
        className={classes.details}
      />
      <div className={classes.details}>
        <PaymentWallet
          {...rest}
          totalCost={costNativeFio}
          filterByBalance={rest.paymentOption === PAYMENT_OPTIONS.FIO}
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
