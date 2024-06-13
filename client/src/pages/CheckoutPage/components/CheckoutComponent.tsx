import React from 'react';
import isEmpty from 'lodash/isEmpty';

import CartItem from '../../../components/Cart/CartItem';
import { TransactionDetails } from '../../../components/TransactionDetails/TransactionDetails';
import { VALUE_POSITIONS } from '../../../components/TransactionDetails/constants';
import { PaymentWallet } from './PaymentWallet';
import { PaymentOptionComponent } from './PaymentOptionComponent';

import { totalCost } from '../../../util/cart';

import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import { CheckoutComponentProps } from '../types';

import classes from '../CheckoutPage.module.scss';

export const CheckoutComponent: React.FC<CheckoutComponentProps> = props => {
  const { cart, roe, payment, ...rest } = props;
  const {
    fioWalletsBalances,
    paymentAssignmentWallets,
    isNoProfileFlow,
    paymentWalletPublicKey,
  } = rest;
  const { costNativeFio, costFree } = totalCost(cart, roe);

  const getPayWithDefaultDetails = () => {
    if (paymentAssignmentWallets.length === 0) {
      return;
    }

    const [wallet] = paymentAssignmentWallets;
    const balance = fioWalletsBalances.wallets[wallet.publicKey];

    if (!balance) {
      return;
    }

    return {
      walletName: wallet.name,
      walletBalances: balance.available,
    };
  };

  const payWith = getPayWithDefaultDetails();

  const additionalTransactionDetails = [];

  if (isNoProfileFlow) {
    additionalTransactionDetails.push({
      label: 'Register to Public Key',
      value: paymentWalletPublicKey,
      wrap: true,
    });
  }

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Purchase Details</h6>
        {!isEmpty(cart) &&
          cart.map(item => <CartItem item={item} key={item.id} isEditable />)}
      </div>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Transaction Details</h6>
        <TransactionDetails
          valuePosition={payWith ? VALUE_POSITIONS.LEFT : VALUE_POSITIONS.RIGHT}
          feeInFio={0}
          amountInFio={costNativeFio}
          payWith={payWith}
          additional={additionalTransactionDetails}
        />
      </div>
      {paymentAssignmentWallets.length > 1 && (
        <div className={classes.details}>
          <PaymentWallet
            {...rest}
            totalCost={costNativeFio}
            includePaymentMessage={rest.paymentOption === PAYMENT_OPTIONS.FIO}
          />
        </div>
      )}
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
