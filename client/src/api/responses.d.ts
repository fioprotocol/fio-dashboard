import {
  AdminSearchResult,
  AdminUser,
  ChainCodeProps,
  ContainedFlowQueryParams,
  FioAccountProfile,
  FioWalletDoublet,
  Notification,
  Order,
  OrderDetailed,
  Payment,
  RefProfile,
  User,
  WrapStatusWrapItem,
  UserDetails,
  UserOrderDetails,
  RefProfileDomain,
  FioApiUrls,
  OrderDetails,
} from '../types';

export type DefaultSuccessResponse = { success: true };

export type DefaultNotFoundResponse = { success: false; message: 'Not Found' };

export type AccountGetWalletsResponse = FioWalletDoublet[];
export type AccountSetWalletsResponse = DefaultSuccessResponse;
export type AccountAddWalletsResponse = FioWalletDoublet;
export type AccountUpdateWalletsResponse = DefaultSuccessResponse;
export type AccountDeleteWalletResponse = DefaultSuccessResponse;
export type AccountValidateWalletImportResponse = {
  valid: true;
};

export type AuthProfileResponse = User;
export type AuthUsernameResponse = string;
export type AuthLoginResponse = {
  jwt: string;
};
export type AuthAvailableResponse = boolean;
export type AuthNonceResponse = { email: string; nonce: string };
export type AuthSignUpResponse = User;
export type AuthConfirmResponse = {
  stateData: { containedFlowQueryParams?: ContainedFlowQueryParams };
} & User;
export type AuthSetRecoveryResponse = void;
export type AuthLogoutResponse = null;
export type AuthResendRecoveryResponse = DefaultSuccessResponse;
export type AuthUpdateEmailResponse = DefaultSuccessResponse;
export type AuthCreateNewDeviceRequestResponse = null;
export type AuthDeleteNewDeviceRequestResponse =
  | DefaultSuccessResponse
  | DefaultNotFoundResponse;
export type AuthUpdateNewDeviceResponse = null;
export type AuthProfileSendEvent = DefaultSuccessResponse;
export type AuthCheckRejectedResponse = boolean;
export type AdminAuthLoginResponse = { jwt: string };
export type AdminResetPasswordResponse =
  | DefaultSuccessResponse
  | DefaultNotFoundResponse;
export type AdminChangePasswordResponse =
  | DefaultSuccessResponse
  | DefaultNotFoundResponse;
export type AdminChange2Fa = DefaultSuccessResponse | DefaultNotFoundResponse;

export type AbstractEmailVerificationResponse = {
  isValid: boolean;
};

export type ChainCodesListResults = ChainCodeProps[] | null;

export type ContactsListResponse = string[];
export type ContactsCreateResponse = string;

export type DomainsWatchlistListResponse = {
  id: string;
  domain: string;
  createdAt: string;
}[];

export type FioRegPricesResponse = {
  pricing: {
    nativeFio: {
      domain: number;
      address: number;
      renewDomain: number;
      addBundles: number;
    };
    usdtRoe: number;
  };
};
export type FioRegCaptchaResponse = {
  success: boolean;
  gt?: string;
  challenge?: string;
  new_captcha?: number;
  error?: string;
};
export type FioRegApiUrlsResponse = string[];

export type InfuraNftsResponse = {
  token_address: string;
  token_id: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_hash: string;
  amount: number;
  possible_spam: boolean;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string;
  metadata: string | null;
  last_token_uri_sync: string;
  last_metadata_sync: string;
  minter_address: string;
  normalized_metadata: {
    name: string;
    description: string;
    animation_url: string | null;
    external_link: string | null;
    image: string;
    attributes: [];
  } | null;
  verified_collection: boolean;
}[];

export type InfuraNftsMetadataResponse = {
  contract: string;
  metadata: {
    external_url?: string;
    name: string;
    description: string;
    image: string;
    nft?: {
      external_url?: string;
      name: string;
      description: string;
      image: string;
    };
  };
  tokenId: string;
};

export type NotificationsListResponse = Notification[];
export type NotificationsCreateResponse = Notification;
export type NotificationsUpdateResponse = Notification;

export type RefProfileGetResponse = RefProfile;

export type UsersDetailsResponse = UserDetails;
export type UsersListResponse = {
  users: User[];
  maxCount: number;
};
export type UsersShowResponse = User;

export type OrdersCreateResponse = Order;
export type OrderGetResponse = OrderDetailed;
export type OrdersUpdateResponse = DefaultSuccessResponse;
export type UserOrdersListResponse = {
  data: {
    orders: UserOrderDetails;
    totalOrdersCount: number;
  };
  status: number;
};
export type UserUpdateEmailNotificationResponse = DefaultSuccessResponse;
export type HealthCheckResponse = { success: boolean };
export type VerifyTwitterResponse = {
  verified?: boolean;
  isLocked?: boolean;
  token?: string;
  expires?: number;
};

export type VarsResponse = {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminFioAccountsProfilesListResponse = FioAccountProfile[];
export type AdminPartnersListResponse = RefProfile[];
export type AdminUsersListResponse = AdminUser[];
export type AdminOrdersListResponse = AdminUser[];
export type AdminOrderItemResponse = OrderDetails;
export type AdminFioApiUrlsListResponse = FioApiUrls;
export type AdminFioApiUrlsListUpdateResponse = DefaultSuccessResponse;
export type RemoveAdminResponse =
  | DefaultSuccessResponse
  | DefaultNotFoundResponse;
export type SendResetAdminPasswordResponse =
  | DefaultSuccessResponse
  | DefaultNotFoundResponse;
export type AdminGeneralCreateResponse =
  | DefaultSuccessResponse
  | { success: false; message: 'Not Unique' };
export type AdminConfirmResponse = AdminUser;
export type AdminSearchResponse = AdminSearchResult;

export type WrapStatusListItemsResponse = WrapStatusWrapItem[];

export type PaymentCreateResponse = Payment;

export type ApisResponse = AccountGetWalletsResponse &
  AccountSetWalletsResponse &
  AccountAddWalletsResponse &
  AccountUpdateWalletsResponse &
  AccountDeleteWalletResponse &
  AccountValidateWalletImportResponse &
  AuthProfileResponse &
  AuthUsernameResponse &
  AuthLoginResponse &
  AuthAvailableResponse &
  AuthNonceResponse &
  AuthSignUpResponse &
  AuthConfirmResponse &
  AuthSetRecoveryResponse &
  AuthLogoutResponse &
  AuthResendRecoveryResponse &
  AuthUpdateEmailResponse &
  AuthCreateNewDeviceRequestResponse &
  AuthDeleteNewDeviceRequestResponse &
  AuthUpdateNewDeviceResponse &
  AuthCheckRejectedResponse &
  ContactsListResponse &
  ContactsCreateResponse &
  FioRegPricesResponse &
  FioRegCaptchaResponse &
  NotificationsListResponse &
  NotificationsCreateResponse &
  NotificationsUpdateResponse &
  RefProfileGetResponse &
  UsersDetailsResponse &
  UsersListResponse &
  UsersShowResponse &
  OrdersCreateResponse &
  AdminUsersListResponse &
  RemoveAdminResponse &
  AdminGeneralCreateResponse &
  AdminConfirmResponse &
  PaymentCreateResponse &
  ChainCodesListResults &
  UserOrdersListResponse &
  HealthCheckResponse &
  VarsResponse;

export type Rankable = {
  rank: number;
};

export type AdminDomain = Rankable & {
  id?: string | number;
  name: string;
  isPremium: boolean;
  isDashboardDomain: boolean;
};

export type SearchTerm = Rankable & {
  id?: string | number;
  term: string;
  isPrefix: boolean;
};

export type UsernameOnDomain = Rankable & {
  id?: string | number;
  username: string;
};

export type DomainsResponse = {
  availableDomains: AdminDomain[];
  dashboardDomains: AdminDomain[];
  usernamesOnCustomDomains: UsernameOnDomain[];
  allRefProfileDomains: RefProfileDomain[];
};

export type SearchPrefixesAndPostfixes = {
  searchPrefixes: SearchTerm[];
  searchPostfixes: SearchTerm[];
};

export type AdminDefaults = SearchPrefixesAndPostfixes & DomainsResponse;

export type AdminDefaultsRequest = AdminDefaults & {
  availableDomainsToDelete?: string[];
  dashboardDomainsToDelete?: string[];
  searchPostfixesToDelete?: string[];
  searchPrefixesToDelete?: string[];
  usernamesOnCustomDomainsToDelete?: string[];
};

export type DefaultsAvailableDomainsResponse = AdminDomain[];

export type FioDomainDoubletResponse = {
  id: string;
  name: string;
  domainhash: string;
  account: string;
  is_public: number;
  expiration: number;
};

export type GenericStatusResponse = {
  success: boolean;
};
