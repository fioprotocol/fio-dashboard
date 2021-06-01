import { prefix } from './actions';

export const showLogin = state => state[prefix].showLogin;
export const hasRedirect = state => state[prefix].hasRedirect;
export const showRecovery = state => state[prefix].showRecovery;
export const showPinConfirm = state => state[prefix].showPinConfirm;
