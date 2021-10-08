import { prefix } from './actions';
import { ReduxState } from '../../redux/init';

export const showLogin = (state: ReduxState) => state[prefix].showLogin;
export const showRecovery = (state: ReduxState) => state[prefix].showRecovery;
export const showPinConfirm = (state: ReduxState) =>
  state[prefix].showPinConfirm;
export const pinConfirmData = (state: ReduxState) =>
  state[prefix].pinConfirmData;
export const showGenericError = (state: ReduxState) =>
  state[prefix].showGenericError;
export const showEmailConfirmBlocker = (state: ReduxState) =>
  state[prefix].showEmailConfirmBlocker;
export const emailConfirmBlockerToken = (state: ReduxState) =>
  state[prefix].emailConfirmBlockerToken;
export const genericErrorData = (state: ReduxState) =>
  state[prefix].genericErrorData;
export const showFreeAddressAwaiter = (state: ReduxState) =>
  state[prefix].showFreeAddressAwaiter;
