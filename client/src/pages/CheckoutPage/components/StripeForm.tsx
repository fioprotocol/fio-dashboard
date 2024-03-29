import React, {
  useEffect,
  useState,
  FormEvent,
  useCallback,
  useRef,
} from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { StripePaymentElementChangeEvent } from '@stripe/stripe-js/types/stripe-js/elements/payment';

import Loader from '../../../components/Loader/Loader';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import {
  ErrorBadge,
  COLOR_TYPE,
  ERROR_UI_TYPE,
} from '../../../components/Input/ErrorBadge';
import { ANALYTICS_EVENT_ACTIONS } from '../../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';

import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../../util/analytics';
import { log } from '../../../util/general';

import apis from '../../../api';

import { ROUTES } from '../../../constants/routes';

import { BeforeSubmitData } from '../types';
import { CartItem as CartItemType, Payment } from '../../../types';

import classes from '../styles/StripePaymentOption.module.scss';

const PAYMENT_METHODS = {
  CARD: 'card',
  GOOGLE_PAY: 'google_pay',
  APPLE_PAY: 'apple_pay',
  WECHAT_PAY: 'wechat_pay',
};

export const StripeForm: React.FC<{
  cart: CartItemType[];
  onFinish: (success: boolean, data?: BeforeSubmitData) => void;
  beforeSubmit: (handleSubmit: () => Promise<void>) => Promise<void>;
  orderNumber: string;
  payment: Payment;
}> = ({ cart, orderNumber, onFinish, beforeSubmit, payment }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>(
    PAYMENT_METHODS.CARD,
  );
  const [submitData, setSubmitData] = useState<BeforeSubmitData | null>(null);
  const confirmRef = useRef<boolean>(false);

  const paymentId = payment && payment.id;
  const cancelPayment = useCallback(() => {
    apis.payments.cancel(paymentId).catch(e => log.error(e.message));
  }, [paymentId]);
  const handleSubmit = async (beforeSubmitData?: BeforeSubmitData) => {
    if (paymentMethod === PAYMENT_METHODS.APPLE_PAY && beforeSubmitData) {
      return setSubmitData(beforeSubmitData);
    }

    if (submitData) beforeSubmitData = submitData;

    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.PURCHASE_STARTED,
      getCartItemsDataForAnalytics(cart),
    );

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    confirmRef.current = true;
    let errorMsg;
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${process.env.REACT_APP_BASE_URL?.slice(0, -1)}${
          ROUTES.CHECKOUT
        }?${QUERY_PARAMS_NAMES.ORDER_NUMBER}=${orderNumber}`,
      },
    });
    confirmRef.current = false;

    if (error) {
      errorMsg = error.message;

      if (error.payment_intent && error.payment_intent.status === 'succeeded')
        errorMsg = null;
    }

    if (
      paymentIntent &&
      (paymentIntent.status === 'requires_action' ||
        paymentIntent.status === 'requires_payment_method' ||
        paymentIntent.status === 'canceled' ||
        paymentIntent.last_payment_error)
    ) {
      errorMsg = 'Please try again and continue your payment';
    }

    if (errorMsg) setErrorMessage(errorMsg);

    onFinish(!errorMsg, beforeSubmitData);
    setLoading(false);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);

    if (submitData) {
      await handleSubmit();
    } else {
      await beforeSubmit(handleSubmit);
    }

    setLoading(false);
  };

  const onPaymentElChange = (event: StripePaymentElementChangeEvent) => {
    if (event.elementType === 'payment') {
      setPaymentMethod(event.value.type);
      setSubmitData(null);
    }
  };

  useEffect(
    () => () => {
      if (confirmRef.current) {
        cancelPayment(); // Cancel the payment on page change when confirmPayment is in progress
      }
    },
    [cancelPayment],
  );

  if (!stripe || !elements) return <Loader />;

  return (
    <form onSubmit={onSubmit}>
      <h6 className={classes.subtitle}>Card Information</h6>
      <div className={classes.paymentContainer}>
        <PaymentElement onChange={onPaymentElChange} />
      </div>
      <ErrorBadge
        hasError={errorMessage}
        color={COLOR_TYPE.WARN}
        type={ERROR_UI_TYPE.BADGE}
        error={errorMessage}
      />
      <SubmitButton
        text={loading ? 'Processing...' : submitData ? 'Continue' : 'Pay'}
        withTopMargin={true}
        disabled={!stripe || !elements || loading}
        loading={loading}
      />
    </form>
  );
};
