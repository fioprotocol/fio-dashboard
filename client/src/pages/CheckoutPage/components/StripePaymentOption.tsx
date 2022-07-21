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

import { FIO_ADDRESS_DELIMITER } from '../../../utils';
import { PURCHASE_PROVIDER } from '../../../constants/purchase';
import { STRIPE_ELEMENT_OPTIONS, STRIPE_PROMISE } from '../constants';
import { CURRENCY_CODES } from '../../../constants/common';

import { StripePaymentOptionProps } from '../types';

export const StripePaymentOption: React.FC<StripePaymentOptionProps> = props => {
  const { cart, payment, paymentOption, paymentOptionError } = props;

  const history = useHistory();

  const onFinish = (success: boolean) => {
    if (success) {
      props.onFinish({
        errors: [],
        registered: cart.map(
          ({ id, address, domain, isFree, costNativeFio }) => ({
            fioName: address
              ? `${address}${FIO_ADDRESS_DELIMITER}${domain}`
              : domain,
            isFree,
            fee_collected: costNativeFio,
            cartItemId: id,
            transaction_id: '',
          }),
        ),
        partial: [],
        providerTxId: payment.externalPaymentId,
        purchaseProvider: PURCHASE_PROVIDER.STRIPE,
        paymentOption,
        paymentAmount: payment.amount,
        paymentCurrency: CURRENCY_CODES.USD,
      });
    }
  };

  if (paymentOptionError)
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
      stripe={STRIPE_PROMISE}
      options={{
        ...STRIPE_ELEMENT_OPTIONS,
        clientSecret: payment.secret,
        locale: 'en',
      }}
    >
      <StripeForm onFinish={onFinish} />
    </Elements>
  );
};
