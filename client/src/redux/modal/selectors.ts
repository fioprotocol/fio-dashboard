import { prefix } from './actions';

import { ReduxState } from '../../redux/init';
import {
  GenericErrorDataTypes,
  GenericSuccessDataTypes,
  PinConfirmDataTypes,
} from './types';

export const showLogin = (state: ReduxState): boolean =>
  state[prefix].showLogin;
export const showRecovery = (state: ReduxState): boolean =>
  state[prefix].showRecovery;
export const showPinConfirm = (state: ReduxState): boolean =>
  state[prefix].showPinConfirm;
export const pinConfirmData = (state: ReduxState): PinConfirmDataTypes =>
  state[prefix].pinConfirmData;
export const showGenericError = (state: ReduxState): boolean =>
  state[prefix].showGenericError;
export const genericErrorData = (state: ReduxState): GenericErrorDataTypes =>
  state[prefix].genericErrorData;
export const showGenericSuccess = (state: ReduxState): boolean =>
  state[prefix].showGenericSuccess;
export const genericSuccessData = (
  state: ReduxState,
): GenericSuccessDataTypes => state[prefix].genericSuccessData;
