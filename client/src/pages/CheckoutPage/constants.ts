import {
  loadStripe,
  Appearance,
  StripeElementsOptions,
} from '@stripe/stripe-js';

import jsColors from '../../assets/styles/colorsToJs.module.scss';

const fontPath = `${window.location.origin}/static/media/Proxima-Nova-Bold.otf`;

export const STRIPE_PROMISE = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY,
);

const APPEARANCE_STRIPE_OPTIONS: Appearance = {
  theme: 'none',

  variables: {
    colorText: jsColors['baltic-sea'],
    borderRadius: '12px',
  },

  rules: {
    '.Label': {
      fontSize: '13px',
      marginBottom: '10px',
      marginTop: '5px',
    },
    '.Input': {
      outline: 'none',
      padding: '15px 40px',
      fontSize: '14px',
      lineHeight: '20px',
    },
    '.Error': {
      fontSize: '12px',
      marginTop: '10px',
    },
  },
};

export const STRIPE_ELEMENT_OPTIONS: StripeElementsOptions = {
  fonts: [
    {
      family: 'Proxima Nova Bold',
      src: `url(${fontPath}) format('truetype')`,
      weight: '800',
    },
  ],
  appearance: APPEARANCE_STRIPE_OPTIONS,
  loader: 'always',
};

export const STRIPE_REDIRECT_STATUSES = {
  FAILED: 'failed',
  SUCCEEDED: 'succeeded',
};
