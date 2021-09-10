import { ADDRESS, DOMAIN } from './common';

export const LINKS: { [linkKey: string]: string } = {
  HOME: 'HOME',
  DASHBOARD: 'DASHBOARD',
  NOTIFICATIONS: 'NOTIFICATIONS',
  SETTINGS: 'SETTINGS',
  PROFILE: 'PROFILE',
  ABOUT_US: 'ABOUT_US',
  CONTACT_US: 'CONTACT_US',
  FIO_ADDRESSES_SELECTION: 'FIO_ADDRESSES_SELECTION',
  FIO_DOMAINS_SELECTION: 'FIO_DOMAINS_SELECTION',
  FIO_ADDRESSES: 'FIO_ADDRESSES',
  FIO_DOMAINS: 'FIO_DOMAINS',
  FIO_REQUESTS: 'FIO_REQUESTS',
  FIO_WALLET: 'FIO_WALLET',
  GOVERNANCE: 'GOVERNANCE',
  PROTOCOL_UPDATES: 'PROTOCOL_UPDATES',
};

export const LINK_LABELS: { [linkKey: string]: string } = {
  [LINKS.HOME]: 'Home',
  [LINKS.DASHBOARD]: 'Dashboard',
  [LINKS.NOTIFICATIONS]: 'Notifications',
  [LINKS.SETTINGS]: 'Settings',
  [LINKS.PROFILE]: 'My profile',
  [LINKS.ABOUT_US]: 'About Us',
  [LINKS.CONTACT_US]: 'Contact Us',
  [LINKS.FIO_ADDRESSES_SELECTION]: 'FIO Addresses Selection',
  [LINKS.FIO_DOMAINS_SELECTION]: 'FIO Domains Selection',
  [LINKS.FIO_ADDRESSES]: 'FIO Addresses',
  [LINKS.FIO_DOMAINS]: 'FIO Domains',
  [LINKS.FIO_REQUESTS]: 'FIO Requests',
  [LINKS.FIO_WALLET]: 'FIO Wallet',
  [LINKS.GOVERNANCE]: 'Governance',
  [LINKS.PROTOCOL_UPDATES]: 'Protocol Updates',
};

export const fioNameLabels: { [fioNameType: string]: string } = {
  [ADDRESS]: 'Address',
  [DOMAIN]: 'Domain',
};
