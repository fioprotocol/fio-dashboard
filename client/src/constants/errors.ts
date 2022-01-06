export const ERROR_TYPES = {
  default: 'default',
  freeAddressIsNotRegistered: 'freeAddressIsNotRegistered',
};

export const FREE_ADDRESS_REGISTER_ERROR =
  'Address is not registered. Try again and if this error occurs again please contact support.';

export const DEFAULT_FIO_TRX_ERR_MESSAGE =
  'Your purchase has failed due to an error. Your funds remain in your account and your registrations did not complete. Please try again later.';

export const ERROR_MESSAGES = {
  [ERROR_TYPES.default]: DEFAULT_FIO_TRX_ERR_MESSAGE,
  [ERROR_TYPES.freeAddressIsNotRegistered]: FREE_ADDRESS_REGISTER_ERROR,
};

export const TOKEN_LINK_ERROR_MESSAGE =
  'Some public addresses were not transfered due to an error.';
export const TOKEN_LINK_PARTIAL_ERROR_MESSAGE =
  'See below for public addresses which were transfered sucesfully and try again.';
