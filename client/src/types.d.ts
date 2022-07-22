import { EdgeAccount } from 'edge-core-js';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';

import { LocationState, Path } from 'history';

import { FIOSDK_LIB } from './api/fio';

import { CONTAINED_FLOW_ACTIONS } from './constants/containedFlow';
import {
  PURCHASE_PROVIDER,
  PAYMENT_OPTIONS,
  PURCHASE_RESULTS_STATUS,
} from './constants/purchase';
import { CURRENCY_CODES } from './constants/common';

import { ResultsData } from '../components/common/TransactionResults/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unknown = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OwnPropsAny = any; // todo: fix usages for ownProps

export type Domain = { domain: string; free?: boolean };

export type ContainedFlowActionSettingsKey = keyof typeof CONTAINED_FLOW_ACTIONS;

export type CartItem = {
  address?: string;
  domain: string;
  id: string;
  costNativeFio?: number;
  costFio?: string;
  costUsdc?: string;
  hasCustomDomain?: boolean;
  allowFree?: boolean;
  showBadge?: boolean;
  error?: string;
  isFree?: boolean;
  errorType?: string;
  isCustomDomain?: boolean;
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

export type Prices = {
  fio: { address: number; domain: number };
  nativeFio: { address: number; domain: number };
  usdt: { address: number; domain: number };
};

export type IncomePrices = {
  pricing: {
    nativeFio: { address: number; domain: number };
    usdtRoe: number;
  };
};

export type RegistrationErrors = {
  fioName: string;
  error: string;
  isFree?: boolean;
  cartItemId: string;
  errorType: string;
};

export type RegistrationRegistered = {
  fioName: string;
  isFree?: boolean;
  fee_collected: number;
  costUsdc?: string;
  cartItemId: string;
  transaction_id: string;
  transactions?: string[];
};

export type PurchaseProvider = typeof PURCHASE_PROVIDER[keyof typeof PURCHASE_PROVIDER];
export type PaymentCurrency = typeof CURRENCY_CODES[keyof typeof CURRENCY_CODES];
export type PaymentOptionsProps = typeof PAYMENT_OPTIONS[keyof typeof PAYMENT_OPTIONS];
export type PurchaseTxStatus = typeof PURCHASE_RESULTS_STATUS[keyof typeof PURCHASE_RESULTS_STATUS];

export type RegistrationResult = {
  errors: RegistrationErrors[];
  registered: RegistrationRegistered[];
  partial: string[];
  purchaseProvider?: PurchaseProvider;
  providerTxId?: string | number;
  paymentOption?: PaymentOptionsProps;
  paymentAmount?: string;
  paymentCurrency?: PaymentCurrency;
  convertedPaymentCurrency?: PaymentCurrency;
  convertedPaymentAmount?: string;
  providerTxStatus?: PurchaseTxStatus;
};

export type DeleteCartItem =
  | {
      id?: string;
      cartItems?: CartItem[];
    }
  | string;

export type FioWalletDoublet = {
  id: string;
  edgeId: string;
  name: string;
  publicKey: string;
  balance?: number | null;
  available?: number | null;
  locked?: number | null;
  staked?: number | null;
  rewards?: number | null;
  publicWalletFioSdk?: FIOSDK_LIB | null;
  from: string;
};

export type NewFioWalletDoublet = {
  edgeId?: string;
  name: string;
  publicKey: string;
  from: string;
  data?: { derivationIndex?: number; device?: number } & AnyObject;
};

export type FioAddressDoublet = {
  name: string;
  expiration: string;
  remaining: number;
  walletPublicKey: string;
};

export type FioAddressWithPubAddresses = FioAddressDoublet & {
  edgeWalletId: string;
  publicAddresses: PublicAddressDoublet[];
  more: boolean;
};

export type FioDomainDoublet = {
  name: string;
  expiration: string;
  isPublic: number;
  walletPublicKey: string;
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

export type FioNameItemProps = {
  name?: string;
  expiration?: Date;
  remaining?: number;
  isPublic?: number;
  walletPublicKey?: string;
  edgeWalletId?: string;
};

export type LinkResult = {
  updated: PublicAddressDoublet[];
  failed: PublicAddressDoublet[];
  error?: string | null;
};

export type LinkActionResult = {
  connect: LinkResult;
  disconnect: LinkResult;
};

export type WalletKeys = { private: string; public: string };
export type EdgeWalletsKeys = { [edgeWalletId: string]: WalletKeys };

export type PinConfirmation = {
  account?: EdgeAccount;
  keys?: EdgeWalletsKeys;
  action?: string;
  data?: AnyObject;
  error?: string | (Error & { wait?: number });
};

export type FeePrice = {
  nativeFio: number | null;
  fio: string;
  usdc: string;
};

export type FioBalanceRes = {
  balance?: number;
  available?: number;
  locked?: number;
  staked?: number;
  rewards?: number;
  unlockPeriods?: {
    amount: number;
    date: number;
  }[];
};

export type WalletBalancesItem = {
  nativeFio: number | null;
  fio: string;
  usdc: string;
};

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

export type User = {
  email: string;
  username: string;
  fioWallets: FioWalletDoublet[];
  freeAddresses: { name: string }[];
  id: string;
  role: string;
  secretSetNotification: boolean;
  status: string;
  secretSet?: boolean;
  newEmail?: boolean;
  newDeviceTwoFactor?: {
    voucherId: string;
    deviceDescription?: string;
    status: string;
  }[];
  refProfile: { code?: string } | null;
};

export type RefProfile = {
  code: string;
  label: string;
  title: string;
  subTitle: string;
  settings: {
    domains: string[];
    allowCustomDomain: boolean;
    preselectedDomain?: string;
    actions: Record<
      ContainedFlowActionSettingsKey,
      {
        subtitle?: string;
        title?: string;
        hideActionText?: boolean;
        actionText?: string;
      }
    >;

    img: string;
    link: string;
  };
  tpid: string;
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

export type EmailConfirmationStateData = {
  redirectLink?: string;
  refCode?: string;
  containedFlowQueryParams?: ContainedFlowQueryParams | null;
};

export type EmailConfirmationResult = {
  email?: string;
  newEmail?: string;
  oldEmail?: string;
  error?: string;
  success?: boolean;
  stateData?: EmailConfirmationStateData;
};

export type CommonObjectProps = { [key: string]: string };

export type NFTTokenItemProps = keyof NFTTokenDoublet;

export type TransactionItemProps = {
  txId: string;
  currencyCode: string;
  amount: string;
  nativeAmount: string;
  networkFee: string;
  date: number;
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
  obtId?: string;
  chainCode: string;
  tokenCode: string;
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

export type ResponseFioRecord = {
  content: string;
  fio_request_id: number;
  payee_fio_address: string;
  payee_fio_public_key: string;
  payer_fio_address: string;
  payer_fio_public_key: string;
  status: string;
  time_stamp: string;
};

export type FioWalletData = {
  id: string;
  receivedFioRequests: FioRecord[];
  sentFioRequests: FioRecord[];
  obtData: FioRecord[];
};

export type FioWalletTxHistory = {
  highestTxHeight: number;
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
};

export type PrivateRedirectLocationState = {
  from?: { pathname?: string };
  options?: { setKeysForAction?: boolean };
};

export type Proxy = {
  is_proxy: number;
  fioaddress: string;
};

export type FioHistoryNodeAction = {
  account_action_seq: number;
  block_num: number;
  block_time: string;
  action_trace: {
    receiver: string;
    act: {
      account: string;
      name: string;
      data: {
        payee_public_key?: string;
        amount?: number;
        max_fee?: number;
        actor?: string;
        tpid?: string;
        quantity?: string;
        memo?: string;
        to?: string;
        from?: string;
      };
      hex_data: string;
    };
    trx_id: string;
    block_num: number;
    block_time: string;
    producer_block_id: string;
  };
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

export type Order = {
  id: number;
  number: string;
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

export type AdminUserProfile = {
  id: string;
  email: string;
  status: { status: string; id: number };
  role: { role: string; id: number };
  lastLogIn?: string;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  number: string;
  total: string;
  publicKey: string;
  createdAt: string;
  status: number;
  items?: {
    action: string;
    address?: string;
    createdAt: string;
    domain?: string;
    id: string;
    price: string;
    priceCurrency: string;
    updatedAt: string;
  }[];
  payments?: {
    createdAt: string;
    currency?: string;
    paymentEventLogs: {
      id: string;
      status: number;
      statusNotes?: string;
      createdAt: string;
      updatedAt: string;
    }[];
    price?: string;
    processor: string;
    spentType: number;
    status: number;
    updatedAt: string;
    id: string;
  }[];
  user?: { id: string; email: string };
  updatedAt: string;
};

export type Payment = {
  id: number;
  externalPaymentId: string;
  amount: string;
  currency: string;
  secret?: string;
};
