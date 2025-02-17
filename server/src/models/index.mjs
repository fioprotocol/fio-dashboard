import db from '../db';

export const {
  Action,
  AdminUser,
  AdminUsersRole,
  AdminUsersStatus,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  Cart,
  ChainCode,
  Contact,
  Domain,
  DomainsWatchlist,
  FioAccountProfile,
  FioApiUrl,
  FreeAddress,
  GatedRegistrtionTokens,
  LockedFch,
  NewDeviceTwoFactor,
  Nonce,
  Notification,
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  PaymentEventLog,
  PublicWalletData,
  ReferrerProfile,
  ReferrerProfileApiToken,
  SearchTerm,
  TokenCode,
  User,
  Username,
  Var,
  Wallet,
  WrapStatusBlockNumbers,
  WrapStatusEthUnwrapLogs,
  WrapStatusNetworks,
  WrapStatusPolygonUnwrapLogs,
  WrapStatusEthWrapLogs,
  WrapStatusPolygonWrapLogs,
  WrapStatusFioUnwrapNftsLogs,
  WrapStatusFioUnwrapTokensLogs,
  WrapStatusFioWrapNftsLogs,
  WrapStatusFioWrapTokensLogs,
  WrapStatusFioUnwrapNftsOravotes,
  WrapStatusFioUnwrapTokensOravotes,
  WrapStatusFioBurnedDomainsLogs,
  WrapStatusEthOraclesConfirmationsLogs,
  WrapStatusPolygonOraclesConfirmationsLogs,
  WrapStatusPolygonBurnedDomainsLogs,
} = db.models;
