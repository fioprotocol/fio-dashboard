export const EMPTY_STATE_CONTENT = {
  title: 'No FIO Domains',
  message: 'There are no FIO Domains in all your wallets',
};

export const LOAD_ERROR_CONTENT = {
  title: 'Could not load FIO Domains',
  message:
    'Some of your FIO Domains could not be loaded from the FIO blockchain. Please refresh the page or try again later.',
};

export const WARNING_CONTENT = {
  DOMAIN_RENEW: {
    title: 'Domain Renewal',
    message:
      'One or more FIO Domain below has expired. Certain actions are inactive until the domain is renewed. Renew today to restore the actions and to ensure you do not loose the domain.',
  },
  DOMAIN_RENEW_IN_30_DAYS: {
    title: 'Domain Renewal',
    message:
      'One or more FIO Domain below has expired or is about to expire. Renew today to ensure you do not loose the domain.',
  },
};

export const SUCCESS_MESSAGES = {
  CREATE_DOMAIN_WATCHLIST_ITEM: 'The domain was added to your watchlist',
  DELETE_DOMAIN_WATCHLIST_ITEM: 'The domain was deleted from your watchlist',
};
