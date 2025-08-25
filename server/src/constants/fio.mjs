export const CHAIN_CODES = {
  FIO: 'FIO',
  BTC: 'BTC',
  ETH: 'ETH',
  SOCIALS: 'SOCIALS',
};

export const CURRENCY_CODES = {
  FIO: 'FIO',
  wFIO: 'wFIO',
  USDC: 'USDC',
  USD: 'USD',
};

export const METAMASK_DOMAIN_NAME = 'metamask';

export const DOMAIN_EXP_DEBUG_AFFIX = 'testdomainexpiration';

export const DOMAIN_EXP_IN_30_DAYS = 'expsoon';

export const DOMAIN_HAS_TOO_LONG_RENEWAL_PERIOD = 'toolongdomainrenewalperiod';

export const FIO_API_URLS_TYPES = {
  DASHBOARD_API: 'DASHBOARD_API',
  DASHBOARD_HISTORY_URL: 'DASHBOARD_HISTORY_URL',
  WRAP_STATUS_PAGE_API: 'WRAP_STATUS_PAGE_API',
  WRAP_STATUS_PAGE_HISTORY_V2_URL: 'WRAP_STATUS_PAGE_HISTORY_V2_URL',
};

export const TOO_LONG_DOMAIN_RENEWAL_YEAR = 2100; // Temporary 2100 is the max year for domain renewal until BD-4750 will be fixed

//Errors
export const NON_VALID_FCH =
  'FIO Handle only allows letters, numbers and dash in the middle. FIO Handle should be less than 63 characters and username cannot be longer than 36 characters.';
