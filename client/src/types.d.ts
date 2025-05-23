import { MouseEvent as ReactMouseEvent } from 'react';
import { EdgeAccount } from 'edge-core-js';
import { NftItem } from '@fioprotocol/fiosdk';

import { LocationState, Path } from 'history';

import { FIOSDK_LIB, SignedTxArgs } from './api/fio';

import { CONTAINED_FLOW_ACTIONS } from './constants/containedFlow';
import { DOMAIN_TYPE, FIO_ACCOUNT_TYPES } from './constants/fio';
import {
  BC_TX_STATUSES,
  PAYMENT_OPTIONS,
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
  PAYMENT_RESULTS_STATUS,
} from './constants/purchase';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
  CONFIRM_FIO_ACTIONS,
  CURRENCY_CODES,
} from './constants/common';
import {
  SOCIAL_MEDIA_IDS,
  SOCIAL_MEDIA_NAMES,
} from './constants/socialMediaLinks';

import { ResultsData } from '../components/common/TransactionResults/types';
import { DomainsResponse } from './api/responses';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unknown = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OwnPropsAny = any; // todo: fix usages for ownProps

export type ClickEventTypes = ReactMouseEvent<HTMLElement, MouseEvent> & {
  target: { blur: () => void };
};

export type EventObjectType = ReactMouseEvent<HTMLAnchorElement> | undefined;

export type Domain = { domain: string; free?: boolean };

export type ContainedFlowActionSettingsKey = keyof typeof CONTAINED_FLOW_ACTIONS;
export type CartItemType = typeof CART_ITEM_TYPE[keyof typeof CART_ITEM_TYPE];
export type DomainItemType = typeof DOMAIN_TYPE[keyof typeof DOMAIN_TYPE];
export type FioAccountProfileType = typeof FIO_ACCOUNT_TYPES[keyof typeof FIO_ACCOUNT_TYPES];

export type CartItem = {
  address?: string;
  domain: string;
  id: string;
  costNativeFio?: string;
  costFio?: string;
  costUsdc?: string;
  costItemFio?: string;
  costItemUsdc?: string;
  nativeFioAddressPrice?: string;
  hasCustomDomain?: boolean;
  hasCustomDomainInCart?: boolean;
  period?: number;
  allowFree?: boolean;
  showBadge?: boolean;
  error?: string;
  isFree?: boolean;
  errorData?: { code?: string; credited?: string };
  errorType?: string;
  isCustomDomain?: boolean;
  isWatchedDomain?: boolean;
  type?: CartItemType;
  domainType?: DomainItemType;
  signInFioWallet?: FioWalletDoublet;
};

export type Notification = {
  id: number;
  type: string;
  action: string;
  title: string;
  message: string;
  seenDate: string;
  closeDate: string;
  createdAt: string;
  contentType: string;
  isManual?: boolean;
  pagesToShow: string[] | null;
};

export type NotificationParams = {
  type: string;
  action: string;
  title?: string;
  message?: string;
  pagesToShow: string[] | null;
  contentType: string;
};

export type NativePrices = {
  addBundles: string;
  address: string;
  domain: string;
  combo: string;
  renewDomain: string;
};

export type Prices = {
  fio: { address: string; domain: string };
  nativeFio: NativePrices;
  usdt: { address: string; domain: string };
};

export type IncomePrices = {
  pricing: {
    nativeFio: NativePrices;
    usdtRoe: string;
  };
};

export type RegistrationErrors = {
  fioName: string;
  error: string;
  isFree?: boolean;
  cartItemId: string;
  errorType: string;
  errorData?: { code?: string; credited?: string };
};

export type RegistrationRegistered = {
  fioName: string;
  action: string;
  isFree?: boolean;
  fee_collected: string;
  costUsdc?: string;
  cartItemId: string;
  transaction_id: string;
  transactions?: string[];
  data?: {
    signedTx?: SignedTxArgs;
    signingWalletPubKey?: string;
  };
};

export type PaymentProvider = typeof PAYMENT_PROVIDER[keyof typeof PAYMENT_PROVIDER];
export type PaymentCurrency = typeof CURRENCY_CODES[keyof typeof CURRENCY_CODES];
export type PaymentOptionsProps = typeof PAYMENT_OPTIONS[keyof typeof PAYMENT_OPTIONS];
export type PurchaseTxStatus = typeof PURCHASE_RESULTS_STATUS[keyof typeof PURCHASE_RESULTS_STATUS];
export type PaymentStatus = typeof PAYMENT_RESULTS_STATUS[keyof typeof PAYMENT_RESULTS_STATUS];
export type BcTxStatus = typeof BC_TX_STATUSES[keyof typeof BC_TX_STATUSES];

export type VerifyParams = {
  challenge_id: string;
  answer: string;
};

export type RegistrationResult = {
  errors: RegistrationErrors[];
  registered: RegistrationRegistered[];
  partial: string[];
  paymentProvider?: PaymentProvider;
  providerTxId?: string | number;
  paymentOption?: PaymentOptionsProps;
  paymentAmount?: string;
  paymentCurrency?: PaymentCurrency;
  convertedPaymentCurrency?: PaymentCurrency;
  convertedPaymentAmount?: string;
  providerTxStatus?: PurchaseTxStatus;
  captcha?: VerifyParams;
};

export type DeleteCartItem = {
  id: string;
  cartItems?: CartItem[];
  userId?: string;
};

export type FioWalletDoublet = {
  id: string;
  edgeId: string;
  name: string;
  publicKey: string;
  data?: { device?: number; derivationIndex?: number };
  balance?: string | null;
  available?: string | null;
  locked?: string | null;
  staked?: string | null;
  rewards?: string | null;
  publicWalletFioSdk?: FIOSDK_LIB | null;
  from: string;
  failedSyncedWithEdge?: boolean;
};

export type NewFioWalletDoublet = {
  edgeId?: string;
  name: string;
  publicKey: string;
  from: string;
  data?: { derivationIndex?: number; device?: number } & AnyObject;
};

export type FioAddressDoublet = {
  id?: string;
  name: string;
  expiration: number | string;
  remaining: number;
  walletPublicKey: string;
  walletName?: string;
};

export type FioAddressWithPubAddresses = FioNameItemProps & {
  edgeWalletId: string;
  publicAddresses: PublicAddressDoublet[];
  more: boolean;
};

export type FioDomainDoublet = {
  name: string;
  expiration: number | string;
  isPublic: number;
  walletPublicKey: string;
  walletName?: string;
};

export type UserDomainType = {
  name: string;
  domainType: DomainItemType;
};

export type PubilcDomainsType = Partial<DomainsResponse> &
  Partial<RefProfileDomains>;

export type AllDomains = PubilcDomainsType &
  Partial<{ userDomains: UserDomainType[] }>;

export type PrivateDomainsMap = {
  [name: string]: FioDomainDoublet & { wallet: FioWalletDoublet };
};

export type PublicAddressDoublet = {
  publicAddress: string;
  chainCode: string;
  tokenCode: string;
};

export type NFTTokenDoublet = {
  contractAddress: string;
  chainCode: string;
  tokenId: string;
  url?: string;
  hash?: string;
  metadata?: string;
  fioAddress?: string;
};

export type NftTokenResponse = {
  fio_address?: string;
} & NftItem;

export type WalletKeysObj = {
  [walletId: string]: {
    private: string;
    public: string;
  };
};

export type LastAuthData = {
  email: string;
  username: string;
} | null;

export type FioNameType = 'address' | 'domain';

export type FioNameItemProps = Partial<FioAddressDoublet> &
  Partial<FioDomainDoublet> & {
    account?: string;
    id?: string;
    domainsWatchlistItemId?: string;
  };

export type LinkResult = {
  updated: PublicAddressDoublet[];
  failed: PublicAddressDoublet[];
  error?: string | null;
};

export type LinkActionResult = {
  connect: LinkResult;
  disconnect: LinkResult;
} | null;

export type WalletKeys = { private: string; public: string };
export type EdgeWalletsKeys = { [edgeWalletId: string]: WalletKeys };

export type PinConfirmation = {
  account?: EdgeAccount;
  keys?: EdgeWalletsKeys;
  action?: string;
  data?: AnyObject;
  error?: string | (Error & { wait?: number });
};

export type Nonce = {
  challenge: string;
  signatures: string[];
};

export type FeePrice = {
  nativeFio: string | null;
  fio: string;
  usdc: string;
};

export type OracleFees = {
  wrap_fio_tokens: FeePrice;
  wrap_fio_domain: FeePrice;
};

export type FioBalanceRes = {
  balance?: string;
  available?: string;
  locked?: string;
  staked?: string;
  rewards?: string;
  unlockPeriods?: {
    amount: string;
    date: number;
  }[];
};

export type WalletBalancesItem = {
  nativeFio: string | null;
  fio: string;
  usdc: string;
};

export type Roe = string | null;

export type UnlockPeriod = {
  date: Date | null;
} & WalletBalancesItem;

export type WalletBalances = {
  total: WalletBalancesItem;
  available: WalletBalancesItem;
  locked: WalletBalancesItem;
  rewards?: WalletBalancesItem;
  staked?: WalletBalancesItem;
  unlockPeriods?: UnlockPeriod[];
};

export type WalletsBalances = {
  total: WalletBalances;
  wallets: { [publicKey: string]: WalletBalances };
};

export type DomainStatusType = 'private' | 'public';

export type EmailNotificationParamsNamesType =
  | 'fioDomainExpiration'
  | 'fioRequest'
  | 'fioBalanceChange'
  | 'lowBundles';

export type EmailNotificationParamsType = {
  [key: EmailNotificationParamsNamesType]: boolean;
};

export type User = {
  email: string;
  emailNotificationParams: EmailNotificationParamsType;
  username: string;
  fioWallets: FioWalletDoublet[];
  freeAddresses: { name: string }[];
  id: string;
  role: string;
  status: string;
  secretSet?: boolean;
  newEmail?: boolean;
  newDeviceTwoFactor?: {
    id: string;
    voucherId: string;
    deviceDescription?: string;
    status: string;
  }[];
  createdAt: string;
  timeZone: string;
  refProfile: { code?: string } | null;
  affiliateProfile: Pick<RefProfile, 'code', 'settings', 'tpid'> | null;
  userProfileType: string;
};

export type UserDetails = {
  email: string;
  username: string;
  fioWallets: FioWalletDoublet[];
  fioAddresses: FioAddressDoublet[];
  fioDomains: FioDomainDoublet[];
  freeAddresses: { name: string }[];
  id: string;
  role: string;
  status: string;
  secretSet?: boolean;
  createdAt: string;
  timeZone: string;
  refProfile: { code?: string } | null;
  affiliateProfile: { code?: string; tpid?: string } | null;
  orders: OrderDefault[];
  userProfileType: string;
};

export type RefProfileDomain = {
  name: string;
  isPremium: boolean;
  rank: number;
  isFirstRegFree: boolean;
  domainType?: DomainItemType;
  allowFree?: boolean;
  hasGatedRegistration?: boolean;
  isExpired?: boolean;
  expirationDate?: string | number;
};
export type RefProfileDomains = { refProfileDomains: RefProfileDomain[] };

export type RefProfile = {
  id?: string;
  type: string;
  code: string;
  label: string;
  title: string;
  subTitle: string;
  settings: {
    domains: RefProfileDomain[];
    actions?: Record<
      ContainedFlowActionSettingsKey,
      {
        subtitle?: string;
        title?: string;
        hideActionText?: boolean;
        actionText?: string;
      }
    >;
    gatedRegistration?: {
      isOn: boolean;
      params: { asset: string; chainId: string; contractAddress: string };
    };
    img?: string;
    isBranded?: boolean;
    hasNoProfileFlow?: boolean;
    link?: string;
  };
  apiAccess?: boolean;
  apiTokens?: {
    id?: number;
    token: string;
    access: boolean;
    dailyFreeLimit?: number | null;
  }[];
  tpid: string;
  freeFioAccountProfileId: string;
  paidFioAccountProfileId: string;
  createdAt?: string;
};

type SignNFTQuery = {
  chain_code: string;
  contract_address: string;
  token_id: string;
  url: string;
  hash: string;
  metadata: string;
};

export type SignNFTParams = {
  chainCode: string;
  contractAddress: string;
  tokenId: string;
  url: string;
  hash: string;
  metadata: {
    creatorUrl: string;
  };
};

export type ContainedFlowQuery = {
  action: ContainedFlowActionSettingsKey;
  r?: string;
} & SignNFTQuery;

export type ContainedFlowQueryParams = {
  action: ContainedFlowActionSettingsKey;
  r?: string;
} & Partial<SignNFTParams>; // could be (SignNFTParams | RenewDomainActionParams | AnyOtherActionParams )

export type CommonObjectProps = { [key: string]: string };

export type NFTTokenItemProps = keyof NFTTokenDoublet;

export type TransactionItemProps = {
  txId: string;
  currencyCode: string;
  amount: string;
  nativeAmount: string;
  networkFee: string;
  date: number;
  timestamp: string;
  blockHeight: number;
  otherParams: {
    isTransferProcessed?: boolean;
    isFeeProcessed?: boolean;
    feeActors?: string[];
  } & AnyObject;
};

export type MappedPublicAddresses = {
  [fioAddress: string]: {
    publicAddresses: PublicAddressDoublet[];
    more: boolean;
  };
};

export type DecryptedFioRecordContent = {
  payeePublicAddress: string;
  amount: string;
  memo: string;
  chainCode: string;
  tokenCode: string;
  obtId?: string;
  chain?: string;
  token?: string;
};

// FioRecord type represents FioRequest and FioObtData
export type FioRecord = {
  content: string;
  fioRequestId: number;
  payeeFioAddress: string;
  payeeFioPublicKey: string;
  payerFioAddress: string;
  payerFioPublicKey: string;
  status: string;
  timeStamp: string;
};

export type FioRecordDecrypted = {
  fioRecord: FioRecord;
  fioDecryptedContent: DecryptedFioRecordContent;
};

export type FioDecryptedRecordData = {
  itemData: FioRecordDecrypted;
  paymentOtbData?: FioRecordDecrypted;
};

export type FioWalletData = {
  id: string;
  receivedFioRequests: FioRecord[];
  sentFioRequests: FioRecord[];
  obtData: FioRecord[];
};

export type FioWalletTxHistory = {
  lastTxActionTime: string | null;
  txs: TransactionItemProps[];
};

export type UsersFioWalletsData = {
  [userId: string]: {
    [walletPublicKey: string]: FioWalletData;
  };
};

export type UsersWalletsTxHistory = {
  [userId: string]: {
    [walletPublicKey: string]: FioWalletTxHistory;
  };
};

export type RedirectLinkData = {
  pathname: Path;
  state?: LocationState;
  search?: string;
  query?: Record<string, string>;
};

export type PrivateRedirectLocationState = {
  from?: {
    pathname?: string;
    search?: string;
  };
  options?: { setKeysForAction?: boolean };
};

export type Proxy = {
  id: number;
  fioaddress: string;
  addresshash: string;
  owner: string;
  proxy: string;
  producers: string[];
  last_vote_weight: string;
  proxied_vote_weight: string;
  is_proxy: number;
  is_auto_proxy: number;
};

export type DetailedProxy = {
  id: number;
  isAutoProxy: number;
  isProxy: number;
  proxy: string;
  owner: string;
  lastVoteWeight: number;
  proxiedVoteWeight: number;
  fioAddress: string;
  producers: string[];
  checked?: boolean;
};

export type FioApiError = Error & { json?: { message?: string } };

export type StatusResponse = { status?: number };

export type LoginFailure = {
  fields?: { [fieldName: string]: AnyType };
  code?: string;
};

export type FioActionExecuted = {
  executeActionType: string;
  result: ResultsData | RegistrationResult;
};

export type Payment = {
  id: number;
  externalPaymentId: string;
  amount: string;
  currency: PaymentCurrency;
  processor: PaymentProvider;
  secret?: string;
};

export type Order = {
  id: number;
  number: string;
  publicKey: string;
  orderItems?: OrderItem[];
  displayOrderItems?: CartItem[];
  payment?: Payment;
};

type OrderDefault = {
  createdAt: string;
  customerIp: string;
  data: AnyObject | null;
  deletedAt: string | null;
  id: string;
  number: string;
  publicKey: string;
  refProfileId: string | null;
  roe: Roe;
  status: number;
  total: string;
  updatedAt: string;
  userId: string;
};

export type AdminResponseFailure = {
  error?: {
    fields?: { [fieldName: string]: AnyType };
  };
  code?: string;
};

export type AdminJwtResponse = {
  data?: { jwt: string };
  code?: string;
};

export type AdminAuthResponse = AdminResponseFailure & AdminJwtResponse;

export type AdminUser = {
  id: string;
  email: string;
  status: { status: string; id: number };
  role: { role: string; id: number };
  lastLogIn?: string;
  createdAt: string;
};

export type FioAccountProfile = {
  id: string;
  actor: string;
  permission: string;
  name: string;
  accountType?: FioAccountProfileType;
  createdAt: string;
  referenceToPartners: boolean;
  domains?: string[];
};

export type AdminUserProfile = {
  id: string;
  email: string;
  status: { status: string; id: number };
  role: { role: string; id: number };
  lastLogIn?: string;
  createdAt: string;
};

export type AdminUserItemProfile = {
  avatar?: string;
  createdAt: string;
  email: string;
  id: string;
  location?: string;
  secretSet: boolean;
  status: string;
  username: string;
};

export type AdminOrderItemProfile = {
  id: string;
  total: string;
  roe: Roe;
  status: number;
  data?: string;
  createdAt: string;
  customerIp: string;
  number: string;
  publicKey: string;
  refProfileId?: string;
  updatedAt: string;
  userId: string;
  userEmail: string;
  paymentProcessor: string;
};

export type AdminSearchResult = {
  result?: {
    orders: AdminOrderItemProfile[];
    users?: AdminUserItemProfile[];
  };
};

export type FioApiUrl = {
  id: string;
  rank: number;
  type: string;
  url: string;
  createdAt: string;
};

export type FioApiUrls = {
  apiUrls: FioApiUrl[];
  maxCount: number;
};

export type PaymentEventLog = {
  id: string;
  status: number;
  statusNotes?: string;
  data?: { fioTxId?: string; fioFee?: number; error?: AnyObject };
  createdAt: string;
  updatedAt: string;
};

export type OrderPaymentItem = {
  createdAt: string;
  currency?: string;
  externalId?: string;
  paymentEventLogs: PaymentEventLog[];
  price?: string;
  processor: PaymentProvider;
  spentType: number;
  status: number;
  updatedAt: string;
  id: string;
  statusNotes?: string;
  data?: {
    roe?: Roe;
    fioName?: string;
    action?: string;
    sendingFioTokens?: boolean;
    webhookData?: {
      charges: { data: { payment_method_details: { type: string } }[] };
    };
  };
};

export type BcTx = {
  id: number;
  action: string;
  txId?: string;
  feeCollected?: number;
};

export type BcTxEvent = {
  blockchainTransactionId: number;
  createdAt: string;
  data: AnyObject;
  id: number;
  status: BcTxStatus;
  statusNotes: string;
  updatedAt: string;
};

export type OrderItem = {
  action: string;
  address?: string;
  createdAt: string;
  domain?: string;
  id: string;
  nativeFio: string;
  price: string;
  priceCurrency: string;
  data: {
    hasCustomDomain?: boolean;
    hasCustomDomainFee?: string;
    period?: number;
    cartItemId?: string;
    type?: string;
  };
  updatedAt: string;
  blockchainTransactions: BcTx[];
  order?: OrderDetails;
  orderItemStatus: {
    txStatus: typeof BC_TX_STATUSES[keyof typeof BC_TX_STATUSES];
  };
  feeCollected?: string;
};

export type OrderDetails = {
  id: string;
  number: string;
  roe: Roe;
  total: string;
  publicKey: string;
  createdAt: string;
  status: number;
  currency?: PaymentCurrency;
  paymentProcessor: PaymentProvider;
  items?: OrderItem[];
  payments?: OrderPaymentItem[];
  blockchainTransactionEvents: BcTxEvent[];
  userId: string;
  userEmail: string;
  refProfileName?: string;
  user?: { id: string; email: string };
  updatedAt: string;
  orderUserType?: string;
};

export type OrderItemPdf = {
  action: string;
  data: {
    hasCustomDomain: boolean;
    hasCustomDomainFee: string;
  };
  feeCollected: string;
  id: string;
  nativeFio: string;
  number: string;
  price: string;
  priceCurrency: string;
  roe: Roe;
  txStatus: number;
  paymentStatus: number;
};

export type DateRange = { startDate?: number; endDate?: number };

export type OrderListFilters = {
  status: number;
  freeStatus: string;
  dateRange: DateRange | null;
  orderUserType: string | null;
  offset?: number;
  limit?: number | null;
};

export type UserOrderDetails = {
  id: string;
  number: string;
  roe: Roe;
  total: string;
  publicKey: string;
  createdAt: string;
  status: number;
  payment: {
    paidWith: string;
    paymentProcessor: string;
  };
  refProfileName: string;
  orderUserType?: string;
};

export type OrderItemDetailed = {
  action: string;
  address?: string;
  domain?: string;
  fee_collected: number;
  costUsdc: string;
  id: string;
  isFree: boolean;
  hasCustomDomain?: boolean;
  period?: number;
  priceString: string;
  transaction_id: string;
  transaction_ids: string[];
  error?: string;
  errorData?: { code?: string; credited?: string; errorType?: string };
  errorType?: string;
  costNativeFio?: number;
  type?: CartItemType;
};

export type OrderDetailedTotalCost = {
  fioNativeTotal: string;
  usdcTotal: string;
  fioTotal: string;
  freeTotalPrice?: string;
  fioTotalPrice?: string;
  usdcTotalPrice?: string;
};

export type ErrBadgesProps = {
  [badgeKey: string]: {
    errorType: string;
    items: OrderItemDetailed[];
    total: OrderDetailedTotalCost;
    totalCurrency: PaymentCurrency;
  };
};

export type OrderDetailed = {
  id: string;
  number: string;
  total: string;
  roe: Roe;
  publicKey: string;
  createdAt: string;
  status: number;
  user?: { id: string; email: string };
  errItems: OrderItemDetailed[];
  regItems: OrderItemDetailed[];
  errorBadges: ErrBadgesProps;
  isAllErrored: boolean;
  isPartial: boolean;
  payment: {
    regTotalCost: OrderDetailedTotalCost;
    errTotalCost?: OrderDetailedTotalCost;
    paidWith: string;
    paymentProcessor: PaymentProvider;
    paymentCurrency: PaymentCurrency;
    paymentStatus: PaymentStatus;
  };
  refProfileName?: string;
};

export type ApiError = {
  code: string;
  fields?: { [fieldName: string]: AnyType };
} | null;

type TokenCodeProps = {
  chainCodeId: string;
  tokenCodeId: string;
  tokenCodeName: string;
};

export type ChainCodeProps = {
  chainCodeId: string;
  chainCodeName: string;
  tokens?: TokenCodeProps[];
};

export type WrapStatusWrapItem = {
  actionType?: string;
  amount?: string;
  approvals: {
    blockNumber?: number;
    blockTimeStamp: string;
    chainCode: string;
    isComplete?: boolean;
    txId?: string;
    txIds?: string[];
    voters?: string[];
  };
  blockNumber: string;
  blockTimestamp: string;
  chain: string;
  domain?: string;
  escrowAccount?: string;
  from: string;
  oracleId?: string;
  status: string;
  to: string;
  tpid?: string;
  voters?: {
    account: string;
    transactionHash: string;
    obtid: string;
    tokenId?: string;
  }[];
  transactionId: string;
};

export type FioActions = typeof CONFIRM_FIO_ACTIONS;
export type AnalyticsEventActions = typeof ANALYTICS_EVENT_ACTIONS;

export type ColorTypes = {
  isBlueGreen?: boolean;
  isGreen?: boolean;
  isOrange?: boolean;
  isRed?: boolean;
  isRose?: boolean;
};

export type AddressWidgetNotification = {
  hasNotification: boolean;
  type: string;
  message: string;
  title: string;
};

export type SocialMediaLinkNameProp = typeof SOCIAL_MEDIA_NAMES[keyof typeof SOCIAL_MEDIA_NAMES];
export type SocialMediaLinkIdProp = typeof SOCIAL_MEDIA_IDS[keyof typeof SOCIAL_MEDIA_IDS];

export type SocialMediaLinkItem = {
  iconSrc: string;
  roundedIconSrc: string;
  tokenName: SocialMediaLinkIdProp;
  name: SocialMediaLinkNameProp;
  link: string;
};

export type AllFioNamesAndWalletsProps = {
  firstFromListFioAddressName: string;
  firstFromListFioDomainName: string;
  firstFromListFioWalletPublicKey: string;
  fioAddresses: FioAddressDoublet[];
  fioDomains: FioDomainDoublet[];
  fioWallets: FioWalletDoublet[];
  fioWalletsBalances: WalletsBalances;
  isFioWalletsBalanceLoading: boolean;
  hasAffiliate: boolean;
  hasDomains: boolean;
  hasAddresses: boolean;
  hasExpiredDomains: boolean;
  hasFCH: boolean;
  hasOneDomain: boolean;
  hasOneFCH: boolean;
  hasNoEmail: boolean;
  hasNoStakedTokens: boolean;
  hasZeroTotalBalance: boolean;
  loading: boolean;
  noMappedPubAddresses: boolean;
  userId: string;
  userType: string;
};

export type DomainWatchlistItem = {
  id: string;
  domain: string;
  createdAt: string;
};

export type AddressWidgetDomain = {
  id: string;
  name: string;
};

declare global {
  interface Window {
    dataLayer: AnyObject[];
  }
}
