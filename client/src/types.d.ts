import { EdgeAccount } from 'edge-core-js';

export type Domain = { domain: string; free?: boolean };

export type CartItem = {
  address?: string;
  domain: string;
  id: string;
  costFio?: number;
  costUsdc?: number;
  hasCustomDomain?: boolean;
  allowFree?: boolean;
  showBadge?: boolean;
  error?: string;
  isFree?: boolean;
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
  pagesToShow: string[] | null;
};

export type Prices = {
  fio: { address: number; domain: number };
  fioNative: { address: number; domain: number };
  usdt: { address: number; domain: number };
  usdtRoe: number;
};

export type RegistrationResult = {
  errors: {
    fioName: string;
    error: string;
    isFree?: boolean;
    cartItemId: string;
  }[];
  registered: {
    fioName: string;
    isFree?: boolean;
    fee_collected: number;
    cartItemId: string;
  }[];
  partial: string[];
};

export type DeleteCartItem =
  | {
      id?: string;
      cartItems?: CartItem[];
    }
  | string;

export type FioWalletDoublet = {
  id: string;
  name: string;
  publicKey: string;
  balance?: number | null;
};

export type FioAddressDoublet = {
  name: string;
  expiration: string;
  remaining: number;
  walletPublicKey: string;
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
  publicAddress: string;
  chainCode: string;
  tokenId: number;
};

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

export type PageNameType = 'address' | 'domain';

export type FioNameItemProps = {
  name?: string;
  expiration?: Date;
  remaining?: number;
  isPublic?: number;
  walletPublicKey?: string;
  publicAddresses?: PublicAddressDoublet[];
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

export type PinConfirmation = {
  account?: EdgeAccount;
  keys?: { [walletId: string]: WalletKeys };
  action?: string;
  data?: any;
  error?: string | Error;
};

export type FeePrice = {
  nativeFio: number | null;
  costFio: number | null;
  costUsdc: number | null;
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
};

export type RefProfile = {
  code: string;
  label: string;
  title: string;
  subTitle: string;
  settings: {
    domains: string[];
    allowCustomDomain: boolean;
    actions: string[];
    img: string;
    link: string;
  };
};

type SignNFTQuery = {
  chain_code: string;
  contract_address: string;
  token_id: string;
  url: string;
  hash: string;
  metadata: string;
};

type RefQuery = {
  action: string;
  r: string;
} & SignNFTQuery;

export type NFTSignature = {
  chainCode: string;
  tokenId: string;
  contractAddress: string;
};
