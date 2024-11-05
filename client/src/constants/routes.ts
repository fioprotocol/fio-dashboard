import { REF_PROFILE_SLUG_NAME } from './ref';

const ROUTES: { [route: string]: string } = {
  HOME: '/',
  TWITTER_HANDLE: '/twitter-handle',
  DASHBOARD: '/myfio',
  NOT_FOUND: '/404',
  UNAVAILABLE: '/unavailable',
  ERROR: '/error',
  SIGN_IN: '/signin',
  RESET_PASSWORD: '/reset-password',

  PROFILE: '/profile',
  PASSWORD_RECOVERY: '/password-recovery',
  CREATE_ACCOUNT: '/create-account',
  CREATE_ACCOUNT_PIN: '/create-account-pin',
  CREATE_ACCOUNT_CONFIRMATION: '/create-account-confirmation',
  CREATE_ACCOUNT_SECRET_QUESTIONS: '/create-account-secret-questions',
  CREATE_ACCOUNT_SECRET_QUESTIONS_SKIP: '/create-account-secret-questions-skip',
  CREATE_ACCOUNT_SECRET_ANSWERS: '/create-account-secret-answers',

  FIO_ADDRESSES_SELECTION: '/fio-handles-selection', //?address= (not required)
  FIO_ADDRESSES_CUSTOM_SELECTION: '/fio-handles-custom', //?address= (not required)
  FIO_DOMAINS_SELECTION: '/fio-domains-selection',
  FIO_ADDRESSES: '/fio-handles',
  FIO_ADDRESSES_SETTINGS: '/fio-handles-settings',
  FIO_DOMAINS: '/fio-domains',
  FIO_DOMAINS_SETTINGS: '/fio-domains-settings',
  FIO_DOMAIN: '/fio-domain',
  FIO_REQUESTS: '/fio-requests',
  FIO_WALLET: '/fio-wallet', // ?publicKey=
  FIO_WALLET_OLD: '/fio-wallet/:publicKey', // ?publicKey=
  FIO_WALLET_DETAILS: '/fio-wallet-details',
  FIO_TOKENS_RECEIVE: '/receive-fio-tokens', // ?publicKey=
  TOKENS: '/tokens',
  IMPORT_WALLET: '/import',
  FIO_AFFILIATE_PROGRAM_LANDING: '/affiliate-program',
  FIO_AFFILIATE_PROGRAM_ENABLED: '/affiliate-program-enabled',

  GOVERNANCE: '/governance',
  GOVERNANCE_OVERVIEW: '/governance/overview',
  GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS:
    '/governance/fio-foundation-board-of-directors',
  GOVERNANCE_BLOCK_PRODUCERS: '/governance/block-producers',
  GOVERNANCE_PROXIES: '/governance/proxies',
  GOVERNANCE_VOTING_HELP: '/governance/voting-help',
  GOVERNANCE_CAST_BOARD_VOTE: '/governance/cast-board-vote',
  GOVERNANCE_CAST_BLOCK_PRODUCER_VOTE: '/governance/cast-block-producer-vote',

  PROTOCOL_UPDATES: '/protocol-updates',

  CART: '/cart',
  CHECKOUT: '/checkout',
  PURCHASE: '/purchase',

  FIO_ADDRESS_OWNERSHIP: '/fio-handle-ownership',
  FIO_ADDRESS_OWNERSHIP_CONFIRMATION: '/fio-handle-confirmation',
  FIO_DOMAIN_OWNERSHIP: '/fio-domain-ownership',
  FIO_DOMAIN_OWNERSHIP_CONFIRMATION: '/fio-domain-ownership-confirmation',
  FIO_DOMAIN_STATUS_CHANGE: '/fio-domain-status-change',
  FIO_DOMAIN_STATUS_CHANGE_CONFIRMATION:
    '/fio-domain-status-change-confirmation',
  FIO_ADDRESS_TRANSFER_RESULTS: '/fio-handle-transfer-results',
  FIO_DOMAIN_TRANSFER_RESULTS: '/fio-domain-transfer-results',
  FIO_DOMAIN_STATUS_CHANGE_RESULTS: '/fio-domain-status-results',
  FIO_ADDRESS_ADD_BUNDLES: '/add-bundles',
  FIO_DOMAIN_RENEW: '/fio-domain-renew',
  FIO_NAME_RENEW_RESULTS: '/fio-name-results',
  FIO_ADDRESS_SIGNATURES: '/nft-signatures', // ?address=
  FIO_ADDRESS_SIGN: '/sign-nft', // ?address= (not required)
  FIO_ADDRESS_SIGN_CONFIRMATION: '/sign-nft-confirmation', // ?address=&id=
  FIO_ADDRESS_NFT_EDIT: '/nft-signatures-edit',
  FIO_REQUEST: '/fio-request',
  FIO_REQUEST_OLD: '/fio-wallet/:publicKey/fio-request/:id',
  FIO_SOCIAL_MEDIA_LINKS: '/fio-social-media', // fioHandle=
  FIO_SOCIAL_MEDIA_LINKS_ADD: '/fio-social-media/add-social-media', // fioHandle=
  FIO_SOCIAL_MEDIA_LINKS_EDIT: '/fio-social-media/edit-social-media', // fioHandle=
  FIO_SOCIAL_MEDIA_LINKS_DELETE: '/fio-social-media/delete-social-media', // fioHandle=

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

  LINK_TOKEN_LIST: '/link-token-list', // ?fioHandle=
  ADD_TOKEN: '/link-token-list/add-token', // ?fioHandle=
  ADD_TOKEN_CONFIRMATION: '/link-token-list/add-token-confirmation',
  EDIT_TOKEN: '/link-token-list/edit-token', // ?fioHandle=
  DELETE_TOKEN: '/link-token-list/delete-token', // ?fioHandle=
  SETTINGS: '/settings',
  ACCOUNT_RECOVERY: '/account-recovery',
  NFT_VALIDATION: '/nft-validation',

  REJECT_FIO_REQUEST: '/reject-fio-request',
  REJECT_FIO_REQUEST_CONFIRMATION: '/reject-fio-request-confirmation',
  CANCEL_FIO_REQUEST: '/cancel-request',
  CANCEL_FIO_REQUEST_CONFIRMATION: '/cancel-request-confirmation',

  ORDERS: '/orders',
  ORDER_DETAILS: '/order-details', // ?orderNumber=
  ORDER_INVOICE: '/order-invoice',

  // Referrer Profile pages
  REF_PROFILE_HOME: `/ref/${REF_PROFILE_SLUG_NAME}`,
  REF_PROFILE_HOME_FCH: `/ref/handle/${REF_PROFILE_SLUG_NAME}`,

  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  COOKIE_NOTICE: '/cookie-notice',

  WRAP_STATUS: '/',
  WRAP_STATUS_WRAP_TOKENS: '/wrapTokens',
  WRAP_STATUS_UNWRAP_TOKENS: '/unwrapTokens',
  WRAP_STATUS_WRAP_DOMAINS: '/wrapDomains',
  WRAP_STATUS_UNWRAP_DOMAINS: '/unwrapDomains',
  WRAP_STATUS_BURNED_DOMAINS: '/burnedDomains',

  METAMASK_LANDING_PAGE: '/metamask',
  METAMASK_GATED_REGISTRATION: '/metamask-fio-handle',

  NO_PROFILE_REGISTER_FIO_HANDLE: `/address/${REF_PROFILE_SLUG_NAME}`, // ?publicKey=
  NO_PROFILE_REGISTER_FIO_DOMAIN: `/domain/${REF_PROFILE_SLUG_NAME}`, // ?publicKey=
  NO_PROFILE_ADD_BUNDLES: `/address/renew/${REF_PROFILE_SLUG_NAME}`, // ?publicKey=
  NO_PROFILE_RENEW_DOMAIN: `/domain/renew/${REF_PROFILE_SLUG_NAME}`, // ?publicKey=
};

export const PUBLIC_ROUTES: string[] = [
  ROUTES.FIO_ADDRESSES_SELECTION,
  ROUTES.FIO_ADDRESSES_CUSTOM_SELECTION,
  ROUTES.FIO_DOMAIN,
  ROUTES.FIO_DOMAINS_SELECTION,
  ROUTES.METAMASK_GATED_REGISTRATION,
  ROUTES.METAMASK_LANDING_PAGE,
];

const ADMIN_ROUTES: { [route: string]: string } = {
  ADMIN_HOME: '/',
  ADMIN_USERS: '/users',
  ADMIN_ORDERS: '/orders',
  ADMIN_LOGIN: '/login',
  ADMIN_CONFIRM_EMAIL: '/confirm-email', // ?hash=&email=
  ADMIN_RESET_PASSWORD: '/reset-password', // ?hash=&email=
  ADMIN_REGULAR_USERS: '/regular-users',
  ADMIN_REGULAR_USER_DETAILS: '/regular-user-details', // ?userId=
  ADMIN_PROFILE: '/profile',
  ADMIN_ACCOUNTS: '/accounts',
  ADMIN_API_URLS: '/api-urls',
  ADMIN_PARTNERS: '/partners',
  ADMIN_SEARCH_RESULT: '/search-result',
  ADMIN_DEFAULTS: '/defaults',
};

export { ROUTES, ADMIN_ROUTES };

export const TOKENS_TAB_ROUTES: string[] = [
  ROUTES.TOKENS,
  ROUTES.FIO_WALLET,
  ROUTES.SEND,
  ROUTES.FIO_TOKENS_REQUEST,
  ROUTES.PAYMENT_DETAILS,
  ROUTES.STAKE,
  ROUTES.UNSTAKE,
];
