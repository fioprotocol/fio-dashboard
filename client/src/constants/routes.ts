const ROUTES: { [route: string]: string } = {
  HOME: '/',
  DASHBOARD: '/myfio',
  NOT_FOUND: '/404',
  ERROR: '/error',
  SIGN_IN: '/signin',

  ADMIN_HOME: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_CONFIRM_EMAIL: '/confirm-admin-email', // ?hash=
  ADMIN_RESET_PASSWORD: '/reset-admin-password', // ?hash=
  ADMIN_REGULAR_USERS: '/admin/regular-users',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_ACCOUNTS: '/admin/accounts',
  ADMIN_SEARCH_RESULT: '/admin/search-result',

  CONFIRM_EMAIL: '/confirm-email', // ?hash=
  CONFIRM_EMAIL_RESULT: '/confirm-email-result',
  PROFILE: '/profile',
  PASSWORD_RECOVERY: '/password-recovery',
  CREATE_ACCOUNT: '/create-account',
  CREATE_ACCOUNT_PIN: '/create-account-pin',
  CREATE_ACCOUNT_CONFIRM: '/create-account-confirm',
  CREATE_ACCOUNT_CONFIRMATION: '/create-account-confirmation',
  CREATE_ACCOUNT_SECRET_QUESTIONS: '/create-account-secret-questions',
  CREATE_ACCOUNT_SECRET_QUESTIONS_SKIP: '/create-account-secret-questions-skip',
  CREATE_ACCOUNT_SECRET_ANSWERS: '/create-account-secret-answers',
  IS_NEW_USER: '/email-confirm-gate',
  NEW_EMAIL_NOT_VERIFIED: '/update-email-confirm-gate',
  CONFIRM_UPDATED_EMAIL: '/confirm-updated-email', // ?hash=

  FIO_ADDRESSES_SELECTION: '/fio-crypto-handles-selection',
  FIO_DOMAINS_SELECTION: '/fio-domains-selection',
  FIO_ADDRESSES: '/fio-crypto-handles',
  FIO_ADDRESSES_SETTINGS: '/fio-crypto-handles-settings',
  FIO_DOMAINS: '/fio-domains',
  FIO_DOMAINS_SETTINGS: '/fio-domains-settings',
  FIO_DOMAIN: '/fio-domain',
  FIO_REQUESTS: '/fio-requests',
  FIO_WALLET: '/fio-wallet', // ?publicKey=
  FIO_WALLET_DETAILS: '/fio-wallet-details',
  TOKENS: '/tokens',
  IMPORT_WALLET: '/import',

  GOVERNANCE: '/governance',
  PROTOCOL_UPDATES: '/protocol-updates',

  CART: '/cart',
  CHECKOUT: '/checkout',
  PURCHASE: '/purchase',

  FIO_ADDRESS_OWNERSHIP: '/fio-crypto-handle-ownership',
  FIO_ADDRESS_OWNERSHIP_CONFIRMATION: '/fio-crypto-handle-confirmation',
  FIO_DOMAIN_OWNERSHIP: '/fio-domain-ownership',
  FIO_DOMAIN_OWNERSHIP_CONFIRMATION: '/fio-domain-ownership-confirmation',
  FIO_DOMAIN_STATUS_CHANGE: '/fio-domain-status-change',
  FIO_DOMAIN_STATUS_CHANGE_CONFIRMATION:
    '/fio-domain-status-change-confirmation',
  FIO_ADDRESS_TRANSFER_RESULTS: '/fio-crypto-handle-transfer-results',
  FIO_DOMAIN_TRANSFER_RESULTS: '/fio-domain-transfer-results',
  FIO_DOMAIN_STATUS_CHANGE_RESULTS: '/fio-domain-status-results',
  FIO_ADDRESS_ADD_BUNDLES: '/add-bundles',
  FIO_ADDRESS_ADD_BUNDLES_CONFIRMATION: '/add-bundles-confirmation',
  FIO_DOMAIN_RENEW: '/fio-domain-renew',
  FIO_NAME_RENEW_RESULTS: '/fio-name-results',
  FIO_ADDRESS_SIGNATURES: '/nft-signatures', // ?address=
  FIO_ADDRESS_SIGN: '/sign-nft', // ?address= (not required)
  FIO_ADDRESS_SIGN_CONFIRMATION: '/sign-nft-confirmation', // ?address=&id=
  FIO_ADDRESS_NFT_EDIT: '/nft-signatures-edit',
  FIO_REQUEST: '/fio-request',

  SEND: '/send', // ?publicKey=
  SEND_CONFIRMATION: '/send-confirmation',
  FIO_TOKENS_REQUEST: '/new-request', // ?publicKey= (not required)
  FIO_TOKENS_REQUEST_CONFIRMATION: '/new-request-confirmation',
  PAYMENT_DETAILS: '/payment-details', // ?publicKey=&fioRequestId
  PAYMENT_DETAILS_CONFIRMATION: '/payment-details-confirmation',
  STAKE: '/stake', // ?publicKey=
  UNSTAKE: '/unstake', // ?publicKey=
  WRAP_TOKENS: '/wrap-tokens', // ?publicKey=
  WRAP_DOMAIN: '/wrap-domain', // ?name=
  UNWRAP_DOMAIN: '/unwrap-domain',
  UNWRAP_TOKENS: '/unwrap-tokens', // ?publicKey=

  LINK_TOKEN_LIST: '/link-token-list',
  ADD_TOKEN: '/link-token-list/add-token',
  ADD_TOKEN_CONFIRMATION: '/link-token-list/add-token-confirmation',
  EDIT_TOKEN: '/link-token-list/edit-token',
  DELETE_TOKEN: '/link-token-list/delete-token',
  SETTINGS: '/settings',
  ACCOUNT_RECOVERY: '/account-recovery',
  NFT_VALIDATION: '/nft-validation',

  REJECT_FIO_REQUEST: '/reject-fio-request',
  REJECT_FIO_REQUEST_CONFIRMATION: '/reject-fio-request-confirmation',

  // Referrer Profile pages
  REF_PROFILE_HOME: '/ref/:refProfileCode',

  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  COOKIE_NOTICE: '/cookie-notice',

  WRAP_STATUS_WRAP_TOKENS: '/wrap-status/wrapTokens',
  WRAP_STATUS_UNWRAP_TOKENS: '/wrap-status/unwrapTokens',
  WRAP_STATUS_WRAP_DOMAINS: '/wrap-status/wrapDomains',
  WRAP_STATUS_UNWRAP_DOMAINS: '/wrap-status/unwrapDomains',
};

export { ROUTES };

export const TOKENS_TAB_ROUTES: string[] = [
  ROUTES.TOKENS,
  ROUTES.FIO_WALLET,
  ROUTES.SEND,
  ROUTES.FIO_TOKENS_REQUEST,
  ROUTES.PAYMENT_DETAILS,
  ROUTES.STAKE,
  ROUTES.UNSTAKE,
];
