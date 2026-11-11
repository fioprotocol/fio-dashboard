// Pure helpers for the FORMS_OF_PAYMENT var ({ stripe, stripeAffiliate, bitpay }).
// Kept free of model imports so they can be unit tested without a database.

const PROCESSORS = {
  FIO: 'FIO',
  STRIPE: 'STRIPE',
  BITPAY: 'BITPAY',
};

/**
 * Parses the stored FORMS_OF_PAYMENT value.
 * Returns null when the value is missing or malformed, which callers treat as
 * "every external provider disabled" (fail closed).
 */
export const parseFormsOfPayment = rawValue => {
  if (rawValue === null || rawValue === undefined || rawValue === '') return null;

  try {
    const parsed = typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

    return parsed;
  } catch (e) {
    return null;
  }
};

/**
 * Whether an order may be created with the given payment processor.
 * FIO is always allowed. STRIPE and BITPAY need their toggle on; affiliate
 * carts additionally need `stripeAffiliate` for card payments (same rule as the
 * client's PaymentOptions).
 */
export const isPaymentProcessorEnabled = ({
  paymentProcessor,
  formsOfPayment,
  isAffiliate = false,
}) => {
  if (paymentProcessor === PROCESSORS.FIO) return true;
  if (!formsOfPayment) return false;

  if (paymentProcessor === PROCESSORS.STRIPE) {
    return !!formsOfPayment.stripe && (!isAffiliate || !!formsOfPayment.stripeAffiliate);
  }

  if (paymentProcessor === PROCESSORS.BITPAY) return !!formsOfPayment.bitpay;

  return false;
};
