export const ERROR_TYPES = {
  default: 'default',
  freeAddressIsNotRegistered: 'freeAddressIsNotRegistered',
  freeAddressError: 'freeAddressError',
  userHasFreeAddress: 'useHasFreeAddress',
};

export const FREE_ADDRESS_REGISTER_ERROR =
  'The crypto handle has been registered but is in a pending status. If your new crypto handle does not show up under FIO Crypto Handles please contact support.';

export const DEFAULT_FIO_TRX_ERR_MESSAGE =
  'There was an error during purchase. No FIO Tokens were deducted from your wallet. Click close and try purchase again.';

export const DEFAULT_FIO_TRX_FREE_ERR_MESSAGE =
  'There was an error during purchase. As a result we could not complete your purchase. Click close and try again.';

export const USER_HAS_FREE_ADDRESS_ERR_MESSAGE =
  'There was an error during purchase. You have already registered a free FIO Crypto Handle';

export const REG_SITE_USER_HAS_FREE_ADDRESS_ERR_MESSAGE =
  'You have already registered a free FIO Crypto Handle for that domain';

export const ERROR_MESSAGES = {
  [ERROR_TYPES.default]: DEFAULT_FIO_TRX_ERR_MESSAGE,
  [ERROR_TYPES.freeAddressIsNotRegistered]: FREE_ADDRESS_REGISTER_ERROR,
  [ERROR_TYPES.freeAddressError]: DEFAULT_FIO_TRX_FREE_ERR_MESSAGE,
  [ERROR_TYPES.userHasFreeAddress]: USER_HAS_FREE_ADDRESS_ERR_MESSAGE,
};

export const TOKEN_LINK_ERROR_MESSAGE =
  'Some public addresses were not transferred due to an error.';
export const TOKEN_LINK_PARTIAL_ERROR_MESSAGE =
  'See below for public addresses which were transferred successfully and try again.';

export const FIO_ADDRESS_ALREADY_EXISTS =
  'Unfortunately no username & domain name combinations are available. Try adding a custom ending to create your FIO Crypto Handle.';

export const DOMAIN_ALREADY_EXISTS =
  'Unfortunately this domain is not available. Please search again or select from the additional domains for sale below.';

export const NON_VALID_FCH =
  'FIO Crypto Handle only allows letters, numbers and dash in the middle';

export const NON_VAILD_DOMAIN =
  'Domain only allows letters, numbers and dash in the middle';

export const INTERNAL_SERVER_ERROR_CODE = 500;
export const NOT_FOUND = 404;
