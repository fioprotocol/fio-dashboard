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

export type AccountGetWalletsResponse = FioWalletDoublet[];
export type AccountSetWalletsResponse = { success: true };
export type AccountAddWalletsResponse = FioWalletDoublet;
export type AccountUpdateWalletsResponse = { success: true };
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
export type AuthResendRecoveryResponse = { success: true };
export type AuthUpdateEmailResponse = { success: true };
export type AuthCreateNewDeviceRequestResponse = null;
export type AuthDeleteNewDeviceRequestResponse =
  | { success: true }
  | { success: false; message: 'Not Found' };
export type AuthUpdateNewDeviceResponse = null;
export type AuthProfileSendEvent = { success: true };
export type AuthCheckRejectedResponse = boolean;
export type AdminAuthLoginResponse = { jwt: string };
export type AdminResetPasswordResponse =
  | { success: true }
  | { success: false; message: 'Not Found' };

export type ChainCodesListResults = ChainCodeProps[] | null;

export type ContactsListResponse = string[];
export type ContactsCreateResponse = string;

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
  contract: string;
  tokenId: string;
  supply: string;
  type: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
}[];

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
export type OrdersUpdateResponse = { success: true };
export type UserOrdersListResponse = {
  data: {
    orders: UserOrderDetails;
    totalOrdersCount: number;
  };
  status: number;
};

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
export type AdminFioApiUrlsListUpdateResponse = { success: true };
export type RemoveAdminResponse =
  | { success: true }
  | { success: false; message: 'Not Found' };
export type SendResetAdminPasswordResponse =
  | { success: true }
  | { success: false; message: 'Not Found' };
export type AdminGeneralCreateResponse =
  | { success: true }
  | { success: false; message: 'Not Unique' };
export type AdminConfirmResponse = AdminUser;
export type AdminSearchResponse = AdminSearchResult;

export type WrapStatusListItemsResponse = WrapStatusWrapItem[];

export type PaymentCreateResponse = Payment;

export type ApisResponse = AccountGetWalletsResponse &
  AccountSetWalletsResponse &
  AccountAddWalletsResponse &
  AccountUpdateWalletsResponse &
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
