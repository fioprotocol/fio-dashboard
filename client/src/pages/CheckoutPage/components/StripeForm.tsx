import React, { useState, FormEvent } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import Loader from '../../../components/Loader/Loader';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import {
  ErrorBadge,
  COLOR_TYPE,
  ERROR_UI_TYPE,
} from '../../../components/Input/ErrorBadge';

import { ANALYTICS_EVENT_ACTIONS } from '../../../constants/common';

import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../../util/analytics';

import { BeforeSubmitData } from '../types';
import { CartItem as CartItemType } from '../../../types';

import classes from '../styles/StripePaymentOption.module.scss';

export const StripeForm: React.FC<{
  cart: CartItemType[];
  onFinish: (success: boolean, data?: BeforeSubmitData) => void;
  beforeSubmit: (handleSubmit: () => Promise<void>) => Promise<void>;
  submitDisabled?: boolean;
}> = ({ cart, onFinish, beforeSubmit, submitDisabled = false }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (beforeSubmitData?: BeforeSubmitData) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    let errorMsg;
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      errorMsg = error.message;

      if (error.payment_intent && error.payment_intent.status === 'succeeded')
        errorMsg = null;
    }

    if (paymentIntent && paymentIntent.status === 'requires_action') {
      errorMsg = 'Please try again and continue your payment';
    }

    if (errorMsg) setErrorMessage(errorMsg);

    onFinish(!errorMsg, beforeSubmitData);
    setLoading(false);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.PURCHASE_STARTED,
      getCartItemsDataForAnalytics(cart),
    );

    await beforeSubmit(handleSubmit);

    setLoading(false);
  };

  if (!stripe || !elements) return <Loader />;

  return (
    <form onSubmit={onSubmit}>
      <h6 className={classes.subtitle}>Card Information</h6>
      <div className={classes.paymentContainer}>
        <PaymentElement />
      </div>
      <ErrorBadge
        hasError={errorMessage}
        color={COLOR_TYPE.WARN}
        type={ERROR_UI_TYPE.BADGE}
        error={errorMessage}
      />
      <SubmitButton
        text={loading ? 'Processing...' : 'Pay'}
        withTopMargin={true}
        disabled={!stripe || !elements || loading || submitDisabled}
        loading={loading}
      />
    </form>
  );
};
