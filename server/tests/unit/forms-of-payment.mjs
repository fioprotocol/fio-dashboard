/* global suite, test */

import { assert } from 'chai';

import {
  isPaymentProcessorEnabled,
  parseFormsOfPayment,
} from '../../src/utils/forms-of-payment.mjs';

const ALL_OFF = { stripe: false, stripeAffiliate: false, bitpay: false };
const ALL_ON = { stripe: true, stripeAffiliate: true, bitpay: true };

suite('Forms of payment');

test('parseFormsOfPayment: parses a JSON string', () => {
  assert.deepEqual(parseFormsOfPayment(JSON.stringify(ALL_OFF)), ALL_OFF);
});

test('parseFormsOfPayment: returns null for missing or malformed values', () => {
  assert.isNull(parseFormsOfPayment(null));
  assert.isNull(parseFormsOfPayment(undefined));
  assert.isNull(parseFormsOfPayment(''));
  assert.isNull(parseFormsOfPayment('{not json'));
  assert.isNull(parseFormsOfPayment('[]'));
  assert.isNull(parseFormsOfPayment('null'));
});

test('FIO is always allowed', () => {
  assert.isTrue(
    isPaymentProcessorEnabled({ paymentProcessor: 'FIO', formsOfPayment: null }),
  );
  assert.isTrue(
    isPaymentProcessorEnabled({ paymentProcessor: 'FIO', formsOfPayment: ALL_OFF }),
  );
});

test('STRIPE and BITPAY are rejected when toggles are off', () => {
  assert.isFalse(
    isPaymentProcessorEnabled({ paymentProcessor: 'STRIPE', formsOfPayment: ALL_OFF }),
  );
  assert.isFalse(
    isPaymentProcessorEnabled({ paymentProcessor: 'BITPAY', formsOfPayment: ALL_OFF }),
  );
});

test('STRIPE and BITPAY are rejected when the var is missing (fail closed)', () => {
  assert.isFalse(
    isPaymentProcessorEnabled({ paymentProcessor: 'STRIPE', formsOfPayment: null }),
  );
  assert.isFalse(
    isPaymentProcessorEnabled({ paymentProcessor: 'BITPAY', formsOfPayment: null }),
  );
});

test('STRIPE and BITPAY are allowed when toggles are on', () => {
  assert.isTrue(
    isPaymentProcessorEnabled({ paymentProcessor: 'STRIPE', formsOfPayment: ALL_ON }),
  );
  assert.isTrue(
    isPaymentProcessorEnabled({ paymentProcessor: 'BITPAY', formsOfPayment: ALL_ON }),
  );
});

test('Affiliate card payments need stripeAffiliate as well', () => {
  const formsOfPayment = { stripe: true, stripeAffiliate: false, bitpay: false };

  assert.isTrue(
    isPaymentProcessorEnabled({ paymentProcessor: 'STRIPE', formsOfPayment }),
  );
  assert.isFalse(
    isPaymentProcessorEnabled({
      paymentProcessor: 'STRIPE',
      formsOfPayment,
      isAffiliate: true,
    }),
  );
});

test('Unknown processors are rejected', () => {
  assert.isFalse(
    isPaymentProcessorEnabled({ paymentProcessor: 'ADMIN', formsOfPayment: ALL_ON }),
  );
});
