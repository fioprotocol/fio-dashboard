import { prefix } from './actions';

export const showLogin = state => state[prefix].showLogin;
export const showRecovery = state => state[prefix].showRecovery;
export const showPinConfirm = state => state[prefix].showPinConfirm;
export const pinConfirmData = state => state[prefix].pinConfirmData;
export const showGenericError = state => state[prefix].showGenericError;
export const genericErrorData = state => state[prefix].genericErrorData;
