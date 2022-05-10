import { ROUTES } from '../../constants/routes';
import colors from '../../assets/styles/colorsToJs.module.scss';

export const BANNER_DATA = {
  address: {
    title: 'Manage My FIO Crypto Handles',
    warningTitle: 'FIO Crypto Handle Renewal',
    warningMessage:
      'One or more FIO Crypto Handles below has expired or is about to expire. Renew today to ensure you do not lose the address.',
    infoTitle: 'Link to Your Crypto',
    infoMessage:
      'One or more FIO Crypto Handles below are not linked to other crypto currencies.',
  },
  domain: {
    title: 'Manage My FIO Domain',
    warningTitle: 'Domain Renewal',
    warningMessage:
      'One or more FIO Domain below has expired or is about to expire. Renew today to ensure you do not lose the domain.',
    infoTitle: 'FIO Crypto Handle Registration',
    infoMessage:
      'Select “Register Address” below to add an address to one of your domains.',
  },
};

export const CTA_BADGE = {
  address: {
    link: ROUTES.FIO_ADDRESSES_SELECTION,
    button: 'Register FIO Crypto Handle',
    title: 'Need an Additional FIO Crypto Handle?',
    text: 'Add a FIO Crypto Handle to a custom domain.',
    color: colors['main-background'],
  },
  domain: {
    link: ROUTES.FIO_DOMAINS_SELECTION,
    button: 'Register FIO Domain',
    title: 'Need another domain?',
    text:
      'Want to register a FIO Crypto Handle or FIO Crypto Handles with a custom domain?',
    color: colors.cyan,
  },
};

export const PAGE_NAME = {
  ADDRESS: 'address',
  DOMAIN: 'domain',
};

export const ITEMS_LIMIT = 25;

export const EXPIRED_DAYS = 30;

export const BUTTONS_TITLE = {
  addBundles: 'Add',
  renew: 'Renew',
  wrap: 'Wrap',
  link: 'Link',
  nft: 'NFT signature',
  register: 'Register FIO Crypto Handle',
  request: 'Request Funds',
};

export const SUBTITLE = {
  [PAGE_NAME.ADDRESS]: 'FIO Crypto Handle owned by all your wallets.',
  [PAGE_NAME.DOMAIN]: 'FIO Domains owned by all your wallets.',
};

export const TABLE_HEADERS_LIST = {
  [PAGE_NAME.ADDRESS]: ['FIO Crypto Handles', 'Bundles', 'Actions'],
  [PAGE_NAME.DOMAIN]: ['Domain', 'Status', 'Exp. Date', 'Actions'],
};

export const FIO_OWNERSHIP = {
  [PAGE_NAME.ADDRESS]: ROUTES.FIO_ADDRESS_OWNERSHIP,
  [PAGE_NAME.DOMAIN]: ROUTES.FIO_DOMAIN_OWNERSHIP,
};

export const PLURAL_NAME = {
  [PAGE_NAME.ADDRESS]: 'FIO Crypto Handles',
  [PAGE_NAME.DOMAIN]: 'Domains',
};
