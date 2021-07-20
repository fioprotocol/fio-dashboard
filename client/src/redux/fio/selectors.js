import { prefix } from './actions';

export const loading = state => state[prefix].loading;
export const fioWallets = state => state[prefix].fioWallets;
export const fioAddresses = state => state[prefix].fioAddresses;
export const fioDomains = state => state[prefix].fioDomains;
export const hasMoreAddresses = state => state[prefix].hasMoreAddresses;
export const hasMoreDomains = state => state[prefix].hasMoreDomains;
