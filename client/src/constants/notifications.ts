export const NOTIFICATIONS_CONTENT_TYPE = {
  ACCOUNT_CONFIRMATION: 'ACCOUNT_CONFIRMATION',
  ACCOUNT_CREATE: 'ACCOUNT_CREATE',
  CART_TIMEOUT: 'CART_TIMEOUT',
  CART_PRICES_CHANGED: 'CART_PRICES_CHANGED',
  UPDATE_EMAIL: 'UPDATE_EMAIL',
  WALLET_IMPORTED: 'WALLET_IMPORTED',
  WALLET_CREATED: 'WALLET_CREATED',
  WALLET_DELETED: 'WALLET_DELETED',
  RESET_ADMIN_USER_PASSWORD: 'RESET_ADMIN_USER_PASSWORD',
  DELETE_ADMIN_USER_SUCCESS: 'DELETE_ADMIN_USER_SUCCESS',
};

export const NOTIFICATIONS_CONTENT: {
  [contentType: string]: { [key: string]: string };
} = {
  [NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CONFIRMATION]: {
    title: 'Account Confirmation',
    message: 'Your email is confirmed',
  },
  [NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CREATE]: {
    title: 'Success',
    message: 'Your account has been created!',
  },
  [NOTIFICATIONS_CONTENT_TYPE.CART_TIMEOUT]: {
    title: 'Cart was emptied',
    message: 'Your cart was emptied due to inactivity',
  },
  [NOTIFICATIONS_CONTENT_TYPE.CART_PRICES_CHANGED]: {
    title: 'Pricing update',
    message: 'Your price has been updated due to pricing changes.',
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
  [NOTIFICATIONS_CONTENT_TYPE.WALLET_DELETED]: {
    title: 'Success',
    message: 'Your wallet has been successfully deleted.',
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

export const ACTIONS = {
  CART_TIMEOUT: 'CART_TIMEOUT',
  CART_PRICES_CHANGED: 'CART_PRICES_CHANGED',
  EMAIL_CONFIRM: 'EMAIL_CONFIRM',
  RESET_ADMIN_USER_PASSWORD: 'RESET_ADMIN_USER_PASSWORD',
  DELETE_ADMIN_USER_SUCCESS: 'DELETE_ADMIN_USER_SUCCESS',
};
