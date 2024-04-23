import { ROUTES } from '../../constants/routes';
import { PAGE_TYPES } from '../WelcomeComponent/constants';
import { ADDRESS, DOMAIN } from '../../constants/common';

import config from '../../config';

import colors from '../../assets/styles/colorsToJs.module.scss';

export const CTA_BADGE_TYPE = {
  ADDRESS: ADDRESS,
  DOMAIN: DOMAIN,
  TOKENS: 'tokens',
};

export const CTA_BADGE = {
  [CTA_BADGE_TYPE.ADDRESS]: {
    link: ROUTES.FIO_ADDRESSES_SELECTION,
    button: 'Register FIO Handle',
    title: 'Need an Additional FIO Handle?',
    text: 'Add a FIO Handle to a custom domain.',
    color: colors['baltic-sea'],
  },
  [CTA_BADGE_TYPE.DOMAIN]: {
    link: ROUTES.FIO_DOMAINS_SELECTION,
    button: 'Register FIO Domain',
    title: 'Need another domain?',
    text: 'Want to register a FIO Handle or FIO Handles with a custom domain?',
    color: colors['dark-slate-blue'],
  },
  [CTA_BADGE_TYPE.TOKENS]: {
    externalLink: config.getTokensUrl,
    button: 'Get Now',
    title: 'Need to Get FIO Tokens?',
    text:
      'FIO tokens are used to pay fees for certain transaction types such as FIO Domain and FIO Handle registrations or adding bundles.',
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
  register: 'Register FIO Handle',
  request: 'Request Funds',
  socialLinks: 'Socials',
};

export const TABLE_HEADERS_LIST = {
  [PAGE_NAME.ADDRESS]: ['FIO Handles', 'Bundles', 'Actions'],
  [PAGE_NAME.DOMAIN]: ['Domain', 'Status', 'Exp. Date', 'Actions'],
};

export const PLURAL_NAME = {
  [PAGE_NAME.ADDRESS]: 'FIO Handles',
  [PAGE_NAME.DOMAIN]: 'Domains',
};

export const WELCOME_COMPONENT_TYPE = {
  [PAGE_NAME.ADDRESS]: PAGE_TYPES.FCH,
  [PAGE_NAME.DOMAIN]: PAGE_TYPES.DOM,
};
