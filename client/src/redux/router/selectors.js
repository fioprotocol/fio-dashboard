import { prefix } from './actions';

export const pathname = state => state[prefix].route.location.pathname;
export const hasRedirect = state => state[prefix].hasRedirect;
