import db from '../db';

export const {
  Action,
  AdminUser,
  User,
  Notification,
  Nonce,
  FreeAddress,
  Wallet,
  ReferrerProfile,
  FioAccountProfile,
  NewDeviceTwoFactor,
  Contact,
  PublicWalletData,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  OrderItemStatus,
  Order,
  OrderItem,
  Payment,
  PaymentEventLog,
  Var,
} = db.models;
