export const NOTIFICATIONS_CONTENT_TYPE = {
  RECOVERY_PASSWORD: 'RECOVERY_PASSWORD',
  ACCOUNT_CONFIRMATION: 'ACCOUNT_CONFIRMATION',
  ACCOUNT_CREATE: 'ACCOUNT_CREATE',
  CART_TIMEOUT: 'CART_TIMEOUT',
  UPDATE_EMAIL: 'UPDATE_EMAIL',
  WALLET_IMPORTED: 'WALLET_IMPORTED',
  WALLET_CREATED: 'WALLET_CREATED',
  RESET_ADMIN_USER_PASSWORD: 'RESET_ADMIN_USER_PASSWORD',
  DELETE_ADMIN_USER_SUCCESS: 'DELETE_ADMIN_USER_SUCCESS',
};

export const NOTIFICATIONS_CONTENT: {
  [contentType: string]: { [key: string]: string };
} = {
  [NOTIFICATIONS_CONTENT_TYPE.RECOVERY_PASSWORD]: {
    title: 'Password Recovery',
    message:
      'You have skipped setting up password recovery, Please make sure to complete this so you do not lose access',
  },
  [NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CONFIRMATION]: {
    title: 'Account Confirmation',
    message: 'Your email is confirmed',
  },
  [NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CREATE]: {
    title: 'Account Created',
    message: "You're all set to start managing FIO Crypto Handles and Domains.",
  },
  [NOTIFICATIONS_CONTENT_TYPE.CART_TIMEOUT]: {
    title: 'Cart was emptied',
    message: 'Your cart was emptied due to inactivity',
  },
  [NOTIFICATIONS_CONTENT_TYPE.UPDATE_EMAIL]: {
    title: 'Email was updated',
    message: 'Your new email is confirmed',
  },
  [NOTIFICATIONS_CONTENT_TYPE.WALLET_IMPORTED]: {
    title: 'Wallet imported',
    message: 'You have successfully imported your FIO wallet.',
  },
  [NOTIFICATIONS_CONTENT_TYPE.WALLET_CREATED]: {
    title: 'Wallet created',
    message: 'You have successfully created your FIO wallet.',
  },
  [NOTIFICATIONS_CONTENT_TYPE.RESET_ADMIN_USER_PASSWORD]: {
    title: 'Reset password',
    message: 'Reset password email has been sent.',
  },
  [NOTIFICATIONS_CONTENT_TYPE.DELETE_ADMIN_USER_SUCCESS]: {
    title: 'Delete user',
    message: 'User has been sent deleted.',
  },
};

export const getDefaultContent = (contentType: string, key: string): string => {
  if (NOTIFICATIONS_CONTENT[contentType]) {
    return NOTIFICATIONS_CONTENT[contentType][key] || '';
  }

  return '';
};
