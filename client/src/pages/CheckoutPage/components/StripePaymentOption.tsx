import React, { useState, useCallback } from 'react';
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

import useEffectOnce from '../../../hooks/general';

import apis from '../../../api';

import { STRIPE_ELEMENT_OPTIONS, STRIPE_PROMISE } from '../constants';

import { StripePaymentOptionProps } from '../types';

export const StripePaymentOption: React.FC<StripePaymentOptionProps> = props => {
  const { paymentOption } = props;

  const history = useHistory();

  const [clientSecret, setClientSecret] = useState<string>('');
  const [clientSecretError, setClientSecretError] = useState<{
    code: string;
  } | null>(null);

  const getClientSecret = useCallback(async () => {
    if (clientSecret) return null;

    try {
      const res = await apis.payments.create({
        orderId: 1, // todo: order is hardcoded, get order from db
        paymentProcessor: paymentOption,
      });
      setClientSecret(res.secret);
    } catch (err) {
      setClientSecretError(err);
      console.error(err);
    }
  }, [clientSecret, paymentOption]);

  useEffectOnce(() => {
    getClientSecret();
  }, [getClientSecret]);

  if (clientSecretError)
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

  if (!clientSecret) return <Loader />;

  return (
    <Elements
      stripe={STRIPE_PROMISE}
      options={{ ...STRIPE_ELEMENT_OPTIONS, clientSecret }}
    >
      <StripeForm />
    </Elements>
  );
};
