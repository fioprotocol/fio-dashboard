export type FormsOfPayment = {
  stripe?: boolean;
  stripeAffiliate?: boolean;
  bitpay?: boolean;
  [key: string]: boolean;
};

// Used whenever FORMS_OF_PAYMENT cannot be loaded or parsed: never advertise a
// payment provider we could not confirm is enabled.
export const FORMS_OF_PAYMENT_ALL_OFF: FormsOfPayment = {
  stripe: false,
  stripeAffiliate: false,
  bitpay: false,
};

export const parseFormsOfPayment = (rawValue: unknown): FormsOfPayment => {
  if (rawValue === null || rawValue === undefined || rawValue === '')
    return { ...FORMS_OF_PAYMENT_ALL_OFF };

  try {
    const parsed =
      typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      return { ...FORMS_OF_PAYMENT_ALL_OFF };

    return parsed as FormsOfPayment;
  } catch (e) {
    return { ...FORMS_OF_PAYMENT_ALL_OFF };
  }
};

export const isStripeEnabled = (
  formsOfPayment: FormsOfPayment | null | undefined,
  isAffiliateEnabled?: boolean,
): boolean =>
  !!formsOfPayment?.stripe &&
  (!isAffiliateEnabled || !!formsOfPayment?.stripeAffiliate);

export const isBitpayEnabled = (
  formsOfPayment: FormsOfPayment | null | undefined,
): boolean => !!formsOfPayment?.bitpay;

export const hasAnyExternalPaymentMethod = (
  formsOfPayment: FormsOfPayment | null | undefined,
  isAffiliateEnabled?: boolean,
): boolean =>
  isStripeEnabled(formsOfPayment, isAffiliateEnabled) ||
  isBitpayEnabled(formsOfPayment);

// Low FIO balance and no card/crypto provider: the cart cannot be paid at all,
// so the cart explains why and where to go instead of offering dead buttons.
export const shouldShowNoPaymentMethod = ({
  hasLowBalance,
  isFree,
  loading,
  cartItemsCount,
  formsOfPayment,
  isAffiliateEnabled,
}: {
  hasLowBalance?: boolean;
  isFree?: boolean;
  loading?: boolean;
  cartItemsCount: number;
  formsOfPayment: FormsOfPayment | null | undefined;
  isAffiliateEnabled?: boolean;
}): boolean =>
  !!hasLowBalance &&
  !isFree &&
  !loading &&
  cartItemsCount > 0 &&
  // null = FORMS_OF_PAYMENT still loading; don't flash the message.
  !!formsOfPayment &&
  !hasAnyExternalPaymentMethod(formsOfPayment, isAffiliateEnabled);
