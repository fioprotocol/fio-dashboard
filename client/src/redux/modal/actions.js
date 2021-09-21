export const prefix = 'modal';

export const SHOW_LOGIN = `${prefix}/SHOW_LOGIN`;
export const CLOSE_LOGIN = `${prefix}/CLOSE_LOGIN`;

export const showLoginModal = hasRedirect => ({
  type: SHOW_LOGIN,
  data: hasRedirect || false,
});

export const closeLoginModal = () => ({
  type: CLOSE_LOGIN,
});

export const SHOW_RECOVERY_PASSWORD = `${prefix}/SHOW_RECOVERY_PASSWORD`;
export const CLOSE_RECOVERY_PASSWORD = `${prefix}/CLOSE_RECOVERY_PASSWORD`;

export const showRecoveryModal = () => ({
  type: SHOW_RECOVERY_PASSWORD,
});

export const closeRecoveryModal = () => ({
  type: CLOSE_RECOVERY_PASSWORD,
});

export const SHOW_PIN_CONFIRM = `${prefix}/SHOW_PIN_CONFIRM`;
export const CLOSE_PIN_CONFIRM = `${prefix}/CLOSE_PIN_CONFIRM`;

export const showPinModal = (confirmAction, data) => ({
  type: SHOW_PIN_CONFIRM,
  data: { confirmAction, data },
});

export const closePinConfirmModal = () => ({
  type: CLOSE_PIN_CONFIRM,
});

export const SHOW_GENERIC_ERROR_MODAL = `${prefix}/SHOW_GENERIC_ERROR_MODAL`;

export const showGenericErrorModal = (message, title) => ({
  type: SHOW_GENERIC_ERROR_MODAL,
  data: { message, title },
});

export const CLOSE_GENERIC_ERROR_MODAL = `${prefix}/CLOSE_GENERIC_ERROR_MODAL`;

export const closeGenericErrorModal = () => ({
  type: CLOSE_GENERIC_ERROR_MODAL,
});
