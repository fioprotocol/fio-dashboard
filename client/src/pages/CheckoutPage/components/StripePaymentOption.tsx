import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useHistory } from 'react-router';

import Loader from '../../../components/Loader/Loader';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import {
  ErrorBadge,
  COLOR_TYPE,
  ERROR_UI_TYPE,
} from '../../../components/Input/ErrorBadge';
import { StripeForm } from './StripeForm';

import { setFioName } from '../../../utils';
import { actionFromCartItem } from '../../../util/cart';

import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';
import { DOMAIN_TYPE } from '../../../constants/fio';
import { STRIPE_ELEMENT_OPTIONS, STRIPE_PROMISE } from '../constants';
import { CURRENCY_CODES, WALLET_CREATED_FROM } from '../../../constants/common';

import { BeforeSubmitData, StripePaymentOptionProps } from '../types';
import { CartItem } from '../../../types';

export const StripePaymentOption: React.FC<StripePaymentOptionProps> = props => {
  const {
    displayOrderItems,
    order,
    payment,
    paymentOption,
    paymentWallet,
    paymentProviderError,
    beforePaymentSubmit,
  } = props;

  const history = useHistory();

  const onFinish = (success: boolean, beforeSubmitData: BeforeSubmitData) => {
    if (success) {
      props.onFinish({
        errors: [],
        registered: displayOrderItems.map(
          ({
            id,
            address,
            domain,
            isFree,
            costNativeFio,
            type,
            domainType,
          }: CartItem) => ({
            action: actionFromCartItem(
              type,
              (paymentWallet?.from === WALLET_CREATED_FROM.EDGE ||
                paymentWallet?.from === WALLET_CREATED_FROM.METAMASK) &&
                domainType === DOMAIN_TYPE.CUSTOM,
            ),
            fioName: setFioName(address, domain),
            isFree,
            fee_collected: costNativeFio,
            cartItemId: id,
            transaction_id: '',
            data: beforeSubmitData?.[setFioName(address, domain)],
          }),
        ),
        partial: [],
        providerTxId: payment.externalPaymentId,
        paymentProvider: PAYMENT_PROVIDER.STRIPE,
        paymentOption,
        paymentAmount: payment.amount,
        paymentCurrency: CURRENCY_CODES.USD,
        convertedPaymentCurrency: CURRENCY_CODES.FIO,
        providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
      });
    }
  };

  if (paymentProviderError)
    return (
      <div className="d-flex justify-content-center flex-column">
        <ErrorBadge
          hasError={true}
          color={COLOR_TYPE.WARN}
          type={ERROR_UI_TYPE.BADGE}
          error={`Sorry, we can't load credit card payment option because of an error. Please click Back button and try again`}
        />
        <SubmitButton
          onClick={() => history.goBack()}
          text="Back"
          withTopMargin={true}
        />
      </div>
    );

  if (!payment || !payment.secret) return <Loader />;

  return (
    <Elements
      key={payment.secret}
      stripe={STRIPE_PROMISE}
      options={{
        ...STRIPE_ELEMENT_OPTIONS,
        clientSecret: payment.secret,
        locale: 'en',
      }}
    >
      <StripeForm
        displayOrderItems={displayOrderItems}
        onFinish={onFinish}
        beforeSubmit={beforePaymentSubmit}
        orderNumber={order?.number}
        payment={payment}
      />
    </Elements>
  );
};
