const ROUTES: { [route: string]: string } = {
  HOME: '/',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  DASHBOARD: '/dashboard',

  CONFIRM_EMAIL: '/confirm-email/:hash',
  PROFILE: '/profile',
  RESET_PASSWORD: '/reset-password/:hash',
  PASSWORD_RECOVERY: '/password-recovery',
  CREATE_ACCOUNT: '/create-account',
  IS_NEW_USER: '/email-confirm-gate',
  NEW_EMAIL_NOT_VERIFIED: '/update-email-confirm-gate',
  CONFIRM_UPDATED_EMAIL: '/confirm-updated-email/:hash',

  FIO_ADDRESSES_SELECTION: '/fio-crypto-handles-selection',
  FIO_DOMAINS_SELECTION: '/fio-domains-selection',
  FIO_ADDRESSES: '/fio-crypto-handles',
  FIO_DOMAINS: '/fio-domains',
  FIO_REQUESTS: '/fio-requests',
  FIO_WALLET: '/fio-wallet/:publicKey',
  TOKENS: '/tokens',
  IMPORT_WALLET: '/tokens/import',

  GOVERNANCE: '/governance',
  PROTOCOL_UPDATES: '/protocol-updates',

  CART: '/cart',
  CHECKOUT: '/checkout',
  PURCHASE: '/purchase',

  FIO_ADDRESS_OWNERSHIP: '/fio-address-ownership',
  FIO_DOMAIN_OWNERSHIP: '/fio-domain-ownership',
  FIO_DOMAIN_STATUS_CHANGE: '/fio-domain-status-change',
  FIO_ADDRESS_TRANSFER_RESULTS: '/fio-crypto-handle-transfer-results',
  FIO_DOMAIN_TRANSFER_RESULTS: '/fio-domain-transfer-results',
  FIO_DOMAIN_STATUS_CHANGE_RESULTS: '/fio-domain-status-results',
  FIO_ADDRESS_ADD_BUNDLES: '/add-bundles',
  FIO_DOMAIN_RENEW: '/fio-domain-renew',
  FIO_NAME_RENEW_RESULTS: '/fio-name-results',
  FIO_ADDRESS_SIGNATURES: '/nft-signatures/:address',
  FIO_ADDRESS_SIGN: '/sign-nft/:address',
  FIO_ADDRESS_NFT_EDIT: '/nft-signatures/:address/edit/:id',
  FIO_REQUEST_DECRYPT: '/fio-wallet/:publicKey/fio-request/:id',

  SEND: '/send/:publicKey',
  FIO_TOKENS_REQUEST: '/new-request/:publicKey?',
  PAYMENT_DETAILS: '/payment-details/:publicKey/:fioRequestId',
  STAKE: '/stake/:publicKey',
  UNSTAKE: '/unstake/:publicKey',

  LINK_TOKEN_LIST: '/link-token-list',
  ADD_TOKEN: '/add-token',
  EDIT_TOKEN: '/edit-token',
  DELETE_TOKEN: '/delete-token',
  SETTINGS: '/settings',
  ACCOUNT_RECOVERY: '/account-recovery',
  NFT_VALIDATION: '/nft-validation',

  REJECT_FIO_REQUEST: '/reject-fio-request',

  // Referrer Profile pages
  REF_PROFILE_HOME: '/ref/:refProfileCode',
  REF_SIGN_NFT: '/ref/:refProfileCode/sign-nft',

  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
};

export { ROUTES };
