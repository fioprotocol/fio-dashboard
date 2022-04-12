import { PinDataType } from './types';
import { CommonAction } from '../types';

export const prefix = 'modal';

export const SHOW_LOGIN = `${prefix}/SHOW_LOGIN`;
export const CLOSE_LOGIN = `${prefix}/CLOSE_LOGIN`;

export const showLoginModal = (redirectLink?: string): CommonAction => ({
  type: SHOW_LOGIN,
  data: redirectLink || '',
});

export const closeLoginModal = (): CommonAction => ({
  type: CLOSE_LOGIN,
});

export const SHOW_RECOVERY_PASSWORD = `${prefix}/SHOW_RECOVERY_PASSWORD`;
export const CLOSE_RECOVERY_PASSWORD = `${prefix}/CLOSE_RECOVERY_PASSWORD`;

export const showRecoveryModal = (): CommonAction => ({
  type: SHOW_RECOVERY_PASSWORD,
});

export const closeRecoveryModal = (): CommonAction => ({
  type: CLOSE_RECOVERY_PASSWORD,
});

export const SHOW_PIN_CONFIRM = `${prefix}/SHOW_PIN_CONFIRM`;
export const CLOSE_PIN_CONFIRM = `${prefix}/CLOSE_PIN_CONFIRM`;

export const showPinModal = (
  confirmAction: string,
  data: PinDataType,
): CommonAction => ({
  type: SHOW_PIN_CONFIRM,
  data: { confirmAction, data },
});

export const closePinConfirmModal = (): CommonAction => ({
  type: CLOSE_PIN_CONFIRM,
});

export const SHOW_GENERIC_ERROR_MODAL = `${prefix}/SHOW_GENERIC_ERROR_MODAL`;

export const showGenericErrorModal = (
  message?: string,
  title?: string,
  buttonText?: string,
): CommonAction => ({
  type: SHOW_GENERIC_ERROR_MODAL,
  data: { message, title, buttonText },
});

export const CLOSE_GENERIC_ERROR_MODAL = `${prefix}/CLOSE_GENERIC_ERROR_MODAL`;

export const closeGenericErrorModal = (): CommonAction => ({
  type: CLOSE_GENERIC_ERROR_MODAL,
});

export const CLEAR_GENERIC_ERROR_DATA = `${prefix}/CLEAR_GENERIC_ERROR_DATA`;

export const clearGenericErrorData = (): CommonAction => ({
  type: CLEAR_GENERIC_ERROR_DATA,
});
