import { LOW_BALANCE_TEXT } from '../components/LinkTokenList/constants';

export const ERROR_TYPES = {
  default: 'default',
  freeAddressError: 'freeAddressError',
  userHasFreeAddress: 'userHasFreeAddress',
  hasRetry: 'hasRetry',
};

export const DEFAULT_FIO_TRX_ERR_MESSAGE =
  'There was an error during purchase. No FIO Tokens were deducted from your wallet. Click close and try purchase again.';

export const DEFAULT_FIO_TRX_ERR_TRY_AGAIN_MESSAGE =
  'There was an error during purchase. No FIO Tokens were deducted from your wallet. Go to your cart to try purchase again.';

export const DEFAULT_FIO_TRX_FREE_ERR_MESSAGE =
  'There was an error during purchase. As a result we could not complete your purchase. Click close and try again.';

export const USER_HAS_FREE_ADDRESS_ERR_MESSAGE =
  'There was an error during purchase. You have already registered a free FIO Handle';

export const REG_SITE_USER_HAS_FREE_ADDRESS_ERR_MESSAGE =
  'You have already registered a free FIO Handle';

export const ERROR_MESSAGES = {
  [ERROR_TYPES.default]: DEFAULT_FIO_TRX_ERR_MESSAGE,
  [ERROR_TYPES.freeAddressError]: DEFAULT_FIO_TRX_FREE_ERR_MESSAGE,
  [ERROR_TYPES.userHasFreeAddress]: USER_HAS_FREE_ADDRESS_ERR_MESSAGE,
  [ERROR_TYPES.hasRetry]: DEFAULT_FIO_TRX_ERR_TRY_AGAIN_MESSAGE,
};

export const TOKEN_LINK_ERROR_MESSAGE =
  'Some public addresses were not transferred due to an error.';
export const TOKEN_LINK_PARTIAL_ERROR_MESSAGE =
  'See below for public addresses which were transferred successfully and try again.';

export const FIO_ADDRESS_ALREADY_EXISTS =
  'Unfortunately no username & domain name combinations are available. Try adding a custom ending to create your FIO Handle.';

export const DOMAIN_ALREADY_EXISTS =
  'Unfortunately this domain is not available. Please search again or select from the additional domains for sale below.';

export const NON_VALID_FCH =
  'FIO Handle only allows letters, numbers and dash in the middle';

export const NON_VAILD_DOMAIN =
  'Domain only allows letters, numbers and dash in the middle';

export const NON_VALID_FIO_PUBLIC_KEY =
  'You have entered an invalid public key. Please check your entry.';

export const INTERNAL_SERVER_ERROR_CODE = 500;
export const NOT_FOUND = 404;

export const DOMAIN_IS_NOT_EXIST =
  'This domain doesn’t exist and is eligible for purchase below.';

export const AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED';
export const TWOFA_TOKEN_IS_NOT_VALID = '2FA_TOKEN_IS_NOT_VALID';

export const ALREADY_REGISTERED_ERROR_TEXT = 'already registered';

export const METAMASK_UNSUPPORTED_MOBILE_MESSAGE =
  'Currenty Sign-in with MetaMask only works on Desktop with MetaMask browser extension v11.0 and up.';

// Ledger Errors
export const UNSUPPORTED_LEDGER_APP_VERSION_NAME = 'DeviceVersionUnsupported';
export const UNSUPPORTED_LEDGER_APP_VERSION_MESSAGE =
  'Device app version unsupported';
export const DISCONNECTED_DEVICE_DURING_OPERATION_ERROR =
  'DisconnectedDeviceDuringOperation';

export const TRANSFER_ERROR_BECAUSE_OF_NOT_BURNED_NFTS =
  'FIO Address NFTs are being burned';

export const CANNOT_TRANSFER_ERROR =
  'This Handle is not ready to be transferred. Please try again shortly.';
export const CANNOT_UPDATE_FIO_HANDLE =
  'Changes to this handle are not allowed at this time. Please try again shortly.';

export const CANNOT_TRANSFER_ERROR_TITLE = 'Cannot Transfer';
export const CANNOT_UPDATE_FIO_HANDLE_TITLE = 'Cannot Update';

export const LOW_BUNDLES_TEXT = {
  buttonText: LOW_BALANCE_TEXT.buttonText,
  messageText:
    'Unfortunately there are not enough bundled transactions available to complete this transaction. Please add more to your FIO Handle now.',
};

export const RATE_LIMIT_TYPE_ERROR = 'RATE_LIMIT';
