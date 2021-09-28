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

export const showGenericErrorModal = (message, title, buttonText) => ({
  type: SHOW_GENERIC_ERROR_MODAL,
  data: { message, title, buttonText },
});

export const CLOSE_GENERIC_ERROR_MODAL = `${prefix}/CLOSE_GENERIC_ERROR_MODAL`;

export const closeGenericErrorModal = () => ({
  type: CLOSE_GENERIC_ERROR_MODAL,
});

export const CLEAR_GENERIC_ERROR_DATA = `${prefix}/CLEAR_GENERIC_ERROR_DATA`;

export const clearGenericErrorData = () => ({
  type: CLEAR_GENERIC_ERROR_DATA,
});

export const SHOW_EMAIL_CONFIRM_BLOCKER = `${prefix}/SHOW_EMAIL_CONFIRM_BLOCKER`;
export const CLOSE_EMAIL_CONFIRM_BLOCKER = `${prefix}/CLOSE_EMAIL_CONFIRM_BLOCKER`;

export const showEmailConfirmBlocker = hasRedirect => ({
  type: SHOW_EMAIL_CONFIRM_BLOCKER,
  data: hasRedirect || false,
});

export const closeEmailConfirmBlocker = () => ({
  type: CLOSE_EMAIL_CONFIRM_BLOCKER,
});
