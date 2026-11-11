import { describe, expect, it } from '@jest/globals';

import {
  FORMS_OF_PAYMENT_ALL_OFF,
  hasAnyExternalPaymentMethod,
  isBitpayEnabled,
  isStripeEnabled,
  parseFormsOfPayment,
  shouldShowNoPaymentMethod,
} from './formsOfPayment';

const ALL_ON = { stripe: true, stripeAffiliate: true, bitpay: true };

describe('parseFormsOfPayment', () => {
  it('parses the stored JSON value', () => {
    expect(parseFormsOfPayment(JSON.stringify(ALL_ON))).toEqual(ALL_ON);
  });

  it.each([null, undefined, '', '{broken', '[]', 'null'])(
    'falls back to all providers off for %p',
    (value: unknown) => {
      expect(parseFormsOfPayment(value)).toEqual(FORMS_OF_PAYMENT_ALL_OFF);
    },
  );
});

describe('provider checks', () => {
  it('treats a not-yet-loaded value (null) as disabled', () => {
    expect(isStripeEnabled(null)).toBe(false);
    expect(isBitpayEnabled(null)).toBe(false);
    expect(hasAnyExternalPaymentMethod(null)).toBe(false);
  });

  it('respects the toggles', () => {
    expect(hasAnyExternalPaymentMethod(FORMS_OF_PAYMENT_ALL_OFF)).toBe(false);
    expect(hasAnyExternalPaymentMethod(ALL_ON)).toBe(true);
    expect(
      hasAnyExternalPaymentMethod({
        ...FORMS_OF_PAYMENT_ALL_OFF,
        bitpay: true,
      }),
    ).toBe(true);
  });

  it('needs stripeAffiliate for affiliate card payments', () => {
    const fop = { stripe: true, stripeAffiliate: false, bitpay: false };
    expect(isStripeEnabled(fop)).toBe(true);
    expect(isStripeEnabled(fop, true)).toBe(false);
  });
});

describe('shouldShowNoPaymentMethod', () => {
  const base = {
    hasLowBalance: true,
    isFree: false,
    loading: false,
    cartItemsCount: 1,
    formsOfPayment: FORMS_OF_PAYMENT_ALL_OFF,
  };

  it('shows when FIO is low and every provider is off', () => {
    expect(shouldShowNoPaymentMethod(base)).toBe(true);
  });

  it('does not show while FORMS_OF_PAYMENT is still loading', () => {
    expect(shouldShowNoPaymentMethod({ ...base, formsOfPayment: null })).toBe(
      false,
    );
  });

  it('does not show when the user can pay', () => {
    expect(shouldShowNoPaymentMethod({ ...base, hasLowBalance: false })).toBe(
      false,
    );
    expect(shouldShowNoPaymentMethod({ ...base, isFree: true })).toBe(false);
    expect(shouldShowNoPaymentMethod({ ...base, formsOfPayment: ALL_ON })).toBe(
      false,
    );
  });

  it('does not show for an empty cart or while loading', () => {
    expect(shouldShowNoPaymentMethod({ ...base, cartItemsCount: 0 })).toBe(
      false,
    );
    expect(shouldShowNoPaymentMethod({ ...base, loading: true })).toBe(false);
  });
});
