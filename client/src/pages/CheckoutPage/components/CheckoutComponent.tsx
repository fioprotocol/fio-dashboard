import React from 'react';
import isEmpty from 'lodash/isEmpty';

import CartItem from '../../../components/Cart/CartItem';
import {
  AdditionalDetails,
  TransactionDetails,
} from '../../../components/TransactionDetails/TransactionDetails';
import { VALUE_POSITIONS } from '../../../components/TransactionDetails/constants';
import { PaymentWallet } from './PaymentWallet';
import { PaymentOptionComponent } from './PaymentOptionComponent';

import { totalCost } from '../../../util/cart';

import { PAYMENT_OPTIONS } from '../../../constants/purchase';

import { CheckoutComponentProps } from '../types';

import classes from '../CheckoutPage.module.scss';
import { CART_ITEM_TYPE } from '../../../constants/common';

export const CheckoutComponent: React.FC<CheckoutComponentProps> = props => {
  const { displayOrderItems, roe, payment, ...rest } = props;
  const {
    fioWallets,
    isNoProfileFlow,
    paymentWalletPublicKey,
    payWith,
    hasPublicCartItems,
  } = rest;

  const { costNativeFio, costFree } = totalCost(displayOrderItems, roe);

  const additionalTransactionDetails: AdditionalDetails[] = [];

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
        {!isEmpty(displayOrderItems) &&
          displayOrderItems.map(item => {
            const walletGroup = payWith.find(
              it => !!it.displayOrderItems.find(it => it.id === item.id),
            );

            let error: string;

            const showMessage =
              walletGroup &&
              walletGroup.notEnoughFio &&
              payment?.processor === PAYMENT_OPTIONS.FIO &&
              item.type === CART_ITEM_TYPE.ADDRESS;

            if (showMessage) {
              error = `Your ${walletGroup.signInFioWallet.name} has a low balance for signing ${item.address}@${item.domain}`;
            }

            return (
              <CartItem item={item} key={item.id} isEditable error={error} />
            );
          })}
      </div>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Transaction Details</h6>
        {payWith.length === 0 ? (
          <TransactionDetails
            valuePosition={VALUE_POSITIONS.RIGHT}
            feeInFio={0}
            amountInFio={costNativeFio}
            additional={additionalTransactionDetails}
          />
        ) : (
          payWith.map(it => (
            <TransactionDetails
              key={it.signInFioWallet.publicKey}
              valuePosition={VALUE_POSITIONS.LEFT}
              feeInFio={0}
              amountInFio={it.totalCostNativeFio}
              payWith={{
                walletName: it.signInFioWallet.name,
                walletBalances: it.available,
              }}
            />
          ))
        )}
      </div>
      {!isNoProfileFlow && fioWallets.length > 1 && (
        <div className={classes.details}>
          <PaymentWallet
            {...rest}
            includePaymentMessage={
              rest.paymentOption === PAYMENT_OPTIONS.FIO && hasPublicCartItems
            }
          />
        </div>
      )}
      <PaymentOptionComponent
        {...rest}
        displayOrderItems={displayOrderItems}
        costFree={costFree}
        totalCost={costNativeFio}
        payment={payment}
      />
    </>
  );
};
