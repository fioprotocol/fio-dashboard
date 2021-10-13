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
  USER_IS_NOT_ACTIVE: '/email-confirm-gate',

  FIO_ADDRESSES_SELECTION: '/fio-addresses-selection',
  FIO_DOMAINS_SELECTION: '/fio-domains-selection',
  FIO_ADDRESSES: '/fio-addresses',
  FIO_DOMAINS: '/fio-domains',
  FIO_REQUESTS: '/fio-requests',
  FIO_WALLET: '/fio-wallet',

  GOVERNANCE: '/governance',
  PROTOCOL_UPDATES: '/protocol-updates',

  CART: '/cart',
  CHECKOUT: '/checkout',
  PURCHASE: '/purchase',

  FIO_ADDRESS_OWNERSHIP: '/fio-address-ownership',
  FIO_DOMAIN_OWNERSHIP: '/fio-domain-ownership',
  FIO_DOMAIN_STATUS_CHANGE: '/fio-domain-status-change',
  FIO_ADDRESS_TRANSFER_RESULTS: '/fio-address-transfer-results',
  FIO_DOMAIN_TRANSFER_RESULTS: '/fio-domain-transfer-results',
  FIO_DOMAIN_STATUS_CHANGE_RESULTS: '/fio-domain-status-results',
  FIO_ADDRESS_RENEW: '/fio-address-renew',
  FIO_DOMAIN_RENEW: '/fio-domain-renew',
  FIO_NAME_RENEW_RESULTS: '/fio-name-results',
  FIO_ADDRESS_SIGNATURES: '/fio-address-signatures/:address',
  FIO_ADDRESS_SIGN: '/fio-address-sign/:address',
  FIO_ADDRESS_NFT_EDIT: '/fio-address-signatures/:address/edit/:id',

  LINK_TOKEN_LIST: '/link-token-list',
  ADD_TOKEN: '/add-token',
  EDIT_TOKEN: '/edit-token',
  DELETE_TOKEN: '/delete-token',
  SETTINGS: '/settings',
  ACCOUNT_RECOVERY: '/account-recovery',

  // Referrer Profile pages
  REF_PROFILE_HOME: '/ref/:refProfileCode',
  REF_SIGN_NFT: '/ref/:refProfileCode/sign-nft',

  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
};

export { ROUTES };
