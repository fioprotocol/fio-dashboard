export const prefix = 'modal';

export const SHOW_LOGIN = `${prefix}/SHOW_LOGIN`;
export const CLOSE_LOGIN = `${prefix}/CLOSE_LOGIN`;

export const showLoginModal = () => ({
  type: SHOW_LOGIN,
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
