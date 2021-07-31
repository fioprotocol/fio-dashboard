import { ROUTES } from '../../constants/routes';
import colors from '../../assets/styles/colorsToJs.module.scss';

export const BANNER_DATA = {
  address: {
    title: 'Manage My FIO Addresses',
    warningTitle: 'Address Renewal',
    warningMessage:
      'One or more FIO Addresses below has expired or is about to expire. Renew today to ensure you do not loose the address.',
    infoTitle: 'Link to Your Crypto',
    infoMessage:
      'One or more FIO Addresses below are not linked to other crypto currencies.',
  },
  domain: {
    title: 'Manage My FIO Domain',
    warningTitle: 'Domain Renewal',
    warningMessage:
      'One or more FIO Domain below has expired or is about to expire. Renew today to ensure you do not loose the domain.',
    infoTitle: 'Address Registration',
    infoMessage:
      'Select “Register Address” below to add an address to one of your domains.',
  },
};

export const CTA_BADGE = {
  address: {
    link: ROUTES.FIO_ADDRESSES_SELECTION,
    button: 'Register FIO Address',
    title: 'Need an Additional Address?',
    text: 'Add an address to a custom domain.',
    color: colors['main-background'],
  },
  domain: {
    link: ROUTES.FIO_DOMAINS_SELECTION,
    button: 'Register FIO Domain',
    title: 'Need another domain?',
    text: 'Want to register an address or addresses with a custom domain?',
    color: colors.cyan,
  },
};

export const PAGE_NAME = {
  ADDRESS: 'address',
  DOMAIN: 'domain',
};

export const ITEMS_LIMIT = 25;

export const EXPIRED_DAYS = 30;
