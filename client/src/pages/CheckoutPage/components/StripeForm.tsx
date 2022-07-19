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

import { ROUTES } from '../../../constants/routes';

import classes from '../styles/StripePaymentOption.module.scss';

export const StripeForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${ROUTES.PURCHASE}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  if (!stripe || !elements) return <Loader />;

  return (
    <form onSubmit={handleSubmit}>
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
        disabled={!stripe || !elements || loading}
        loading={loading}
      />
    </form>
  );
};
