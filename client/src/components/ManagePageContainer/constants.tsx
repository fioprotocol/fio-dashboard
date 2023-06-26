import { ROUTES } from '../../constants/routes';
import { LINKS } from '../../constants/labels';

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

export const CTA_BADGE_TYPE = {
  ADDRESS: 'address',
  DOMAIN: 'domain',
  TOKENS: 'tokens',
};

export const CTA_BADGE = {
  [CTA_BADGE_TYPE.ADDRESS]: {
    link: ROUTES.FIO_ADDRESSES_SELECTION,
    button: 'Register FIO Crypto Handle',
    title: 'Need an Additional FIO Crypto Handle?',
    text: 'Add a FIO Crypto Handle to a custom domain.',
    color: colors['baltic-sea'],
  },
  [CTA_BADGE_TYPE.DOMAIN]: {
    link: ROUTES.FIO_DOMAINS_SELECTION,
    button: 'Register FIO Domain',
    title: 'Need another domain?',
    text:
      'Want to register a FIO Crypto Handle or FIO Crypto Handles with a custom domain?',
    color: colors['dark-slate-blue'],
  },
  [CTA_BADGE_TYPE.TOKENS]: {
    link: ROUTES.FIO_TOKENS_GET,
    button: 'Get Now',
    title: 'Need to Get FIO Tokens?',
    text:
      'FIO tokens are used to pay fees for certain transaction types such as FIO Domain and Crypto Handle registrations or adding bundles.',
    color: colors['light-indigo'],
    ctaText: 'Get FIO Token from one of our partners today.',
  },
} as const;

export const PAGE_NAME = {
  ADDRESS: 'address',
  DOMAIN: 'domain',
};

export const ITEMS_LIMIT = 25;

export const BUTTONS_TITLE = {
  addBundles: 'Add',
  renew: 'Renew',
  wrap: 'Wrap',
  unwrap: 'Unwrap',
  link: 'Link',
  nft: 'NFT signature',
  register: 'Register FIO Crypto Handle',
  request: 'Request Funds',
  socialLinks: 'Socials',
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

export const SETTING_LINK = {
  [PAGE_NAME.ADDRESS]: LINKS.FIO_ADDRESSES_SETTINGS,
  [PAGE_NAME.DOMAIN]: LINKS.FIO_DOMAINS_SETTINGS,
};
