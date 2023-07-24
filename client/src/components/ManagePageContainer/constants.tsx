import { ROUTES } from '../../constants/routes';
import { Types } from '../../pages/DashboardPage/components/WelcomeComponentItem/constants';
import { ADDRESS, DOMAIN } from '../../constants/common';

import colors from '../../assets/styles/colorsToJs.module.scss';

export const CTA_BADGE_TYPE = {
  ADDRESS: ADDRESS,
  DOMAIN: DOMAIN,
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

export const PAGE_NAME: {
  [key: string]: typeof ADDRESS | typeof DOMAIN;
} = {
  ADDRESS: ADDRESS,
  DOMAIN: DOMAIN,
} as const;

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

export const TABLE_HEADERS_LIST = {
  [PAGE_NAME.ADDRESS]: ['FIO Crypto Handles', 'Bundles', 'Actions'],
  [PAGE_NAME.DOMAIN]: ['Domain', 'Status', 'Exp. Date', 'Actions'],
};

export const PLURAL_NAME = {
  [PAGE_NAME.ADDRESS]: 'FIO Crypto Handles',
  [PAGE_NAME.DOMAIN]: 'Domains',
};

export const WELCOME_COMPONENT_TYPE = {
  [PAGE_NAME.ADDRESS]: Types.FCH,
  [PAGE_NAME.DOMAIN]: Types.DOM,
};
