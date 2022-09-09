import {
  AdminSearchResult,
  AdminUser,
  ChainCodeProps,
  ContainedFlowQueryParams,
  Domain,
  FioAccountProfile,
  FioWalletDoublet,
  Notification,
  Order,
  Payment,
  RefProfile,
  User,
  WrapStatusWrapItem,
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
  emailConfirmationToken?: string;
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
export type AuthResendConfirmEmailResponse = { success: true };
export type AuthUpdateEmailRequestResponse = { success: true };
export type AuthUpdateEmailRevertResponse = { success: true };
export type AuthCreateNewDeviceRequestResponse = null;
export type AuthDeleteNewDeviceRequestResponse =
  | { success: true }
  | { success: false; message: 'Not Found' };
export type AuthUpdateNewDeviceResponse = null;
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
    };
    usdtRoe: number;
  };
};
export type FioRegDomainsResponse = { domains: Domain[] };
export type FioRegRegisterResponse = {
  success?: boolean;
  freeAddress?: { id: number; name: string; createdAt: string };
  error?: string;
};
export type FioRegCaptchaResponse = {
  success: boolean;
  gt?: string;
  challenge?: string;
  new_captcha?: number;
  error?: string;
};

export type NotificationsListResponse = Notification[];
export type NotificationsCreateResponse = Notification;
export type NotificationsUpdateResponse = Notification;

export type RefProfileGetResponse = RefProfile;

export type UsersListResponse = User[];
export type UsersShowResponse = User;

export type OrdersCreateResponse = Order;
export type OrdersUpdateResponse = { success: true };

export type AdminFioAccountsProfilesListResponse = FioAccountProfile[];
export type AdminUsersListResponse = AdminUser[];
export type AdminOrdersListResponse = AdminUser[];
export type AdminOrderItemResponse = AdminUser;
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
  AuthResendConfirmEmailResponse &
  AuthUpdateEmailRequestResponse &
  AuthUpdateEmailRevertResponse &
  AuthCreateNewDeviceRequestResponse &
  AuthDeleteNewDeviceRequestResponse &
  AuthUpdateNewDeviceResponse &
  AuthCheckRejectedResponse &
  ContactsListResponse &
  ContactsCreateResponse &
  FioRegPricesResponse &
  FioRegDomainsResponse &
  FioRegRegisterResponse &
  FioRegCaptchaResponse &
  NotificationsListResponse &
  NotificationsCreateResponse &
  NotificationsUpdateResponse &
  RefProfileGetResponse &
  UsersListResponse &
  UsersShowResponse &
  OrdersCreateResponse &
  AdminUsersListResponse &
  RemoveAdminResponse &
  AdminGeneralCreateResponse &
  AdminConfirmResponse &
  PaymentCreateResponse &
  ChainCodesListResults;
