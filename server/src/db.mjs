import Sequelize from 'sequelize';

import config from './config';

import { Action } from './models/Action';
import { AdminUser } from './models/AdminUser.mjs';
import { AdminUsersRole } from './models/AdminUsersRole.mjs';
import { AdminUsersStatus } from './models/AdminUsersStatus.mjs';
import { BlockchainTransaction } from './models/BlockchainTransaction.mjs';
import { BlockchainTransactionEventLog } from './models/BlockchainTransactionEventLog.mjs';
import { ChainCode } from './models/ChainCode.mjs';
import { Contact } from './models/Contact.mjs';
import { FioAccountProfile } from './models/FioAccountProfile';
import { FioApiUrl } from './models/FioApiUrl';
import { FreeAddress } from './models/FreeAddress';
import { LockedFch } from './models/LockedFch.mjs';
import { NewDeviceTwoFactor } from './models/NewDeviceTwoFactor';
import { Nonce } from './models/Nonce';
import { Notification } from './models/Notification';
import { Order } from './models/Order.mjs';
import { OrderItem } from './models/OrderItem.mjs';
import { OrderItemStatus } from './models/OrderItemStatus.mjs';
import { Payment } from './models/Payment.mjs';
import { PaymentEventLog } from './models/PaymentEventLog.mjs';
import { PublicWalletData } from './models/PublicWalletData.mjs';
import { ReferrerProfile } from './models/ReferrerProfile';
import { TokenCode } from './models/TokenCode.mjs';
import { User } from './models/User';
import { Var } from './models/Var.mjs';
import { Wallet } from './models/Wallet';
import { WrapStatusNetworks } from './models/WrapStatusNetworks.mjs';
import { WrapStatusBlockNumbers } from './models/WrapStatusBlockNumbers.mjs';
import { WrapStatusEthWrapLogs } from './models/WrapStatusEthWrapLogs.mjs';
import { WrapStatusEthUnwrapLogs } from './models/WrapStatusEthUnwrapLogs.mjs';
import { WrapStatusPolygonUnwrapLogs } from './models/WrapStatusPolygonUnwrapLogs.mjs';
import { WrapStatusPolygonWrapLogs } from './models/WrapStatusPolygonWrapLogs.mjs';
import { WrapStatusFioUnwrapNftsOravotes } from './models/WrapStatusFioUnwrapNftsOravotes.mjs';
import { WrapStatusFioUnwrapTokensOravotes } from './models/WrapStatusFioUnwrapTokensOravotes.mjs';
import { WrapStatusFioWrapNftsLogs } from './models/WrapStatusFioWrapNftsLogs.mjs';
import { WrapStatusFioUnwrapTokensLogs } from './models/WrapStatusFioUnwrapTokensLogs.mjs';
import { WrapStatusFioWrapTokensLogs } from './models/WrapStatusFioWrapTokensLogs.mjs';
import { WrapStatusFioUnwrapNftsLogs } from './models/WrapStatusFioUnwrapNftsLogs.mjs';
import { WrapStatusEthOraclesConfirmationsLogs } from './models/WrapStatusEthOraclesConfirmationsLogs.mjs';
import { WrapStatusPolygonOraclesConfirmationsLogs } from './models/WrapStatusPolygonOraclesConfirmationsLogs.mjs';
import { Domain } from './models/Domain.mjs';
import { SearchTerm } from './models/SearchTerm.mjs';
import { Username } from './models/Username.mjs';

const sequelize = new Sequelize(config.postgres);

User.init(sequelize);
Action.init(sequelize);
Notification.init(sequelize);
Nonce.init(sequelize);
FreeAddress.init(sequelize);
Wallet.init(sequelize);
ReferrerProfile.init(sequelize);
FioAccountProfile.init(sequelize);
FioApiUrl.init(sequelize);
LockedFch.init(sequelize);
NewDeviceTwoFactor.init(sequelize);
Contact.init(sequelize);
PublicWalletData.init(sequelize);
Order.init(sequelize);
OrderItem.init(sequelize);
OrderItemStatus.init(sequelize);
BlockchainTransaction.init(sequelize);
BlockchainTransactionEventLog.init(sequelize);
Payment.init(sequelize);
PaymentEventLog.init(sequelize);
AdminUsersRole.init(sequelize);
AdminUsersStatus.init(sequelize);
Var.init(sequelize);
AdminUser.init(sequelize);
ChainCode.init(sequelize);
TokenCode.init(sequelize);
WrapStatusNetworks.init(sequelize);
WrapStatusBlockNumbers.init(sequelize);
WrapStatusEthWrapLogs.init(sequelize);
WrapStatusEthUnwrapLogs.init(sequelize);
WrapStatusPolygonUnwrapLogs.init(sequelize);
WrapStatusPolygonWrapLogs.init(sequelize);
WrapStatusFioUnwrapNftsOravotes.init(sequelize);
WrapStatusFioWrapNftsLogs.init(sequelize);
WrapStatusFioUnwrapTokensLogs.init(sequelize);
WrapStatusFioWrapTokensLogs.init(sequelize);
WrapStatusFioUnwrapNftsLogs.init(sequelize);
WrapStatusFioUnwrapTokensOravotes.init(sequelize);
WrapStatusEthOraclesConfirmationsLogs.init(sequelize);
WrapStatusPolygonOraclesConfirmationsLogs.init(sequelize);
Domain.init(sequelize);
SearchTerm.init(sequelize);
Username.init(sequelize);

const { models } = sequelize;

for (const modelName in models) {
  const model = models[modelName];
  if ('associate' in model) {
    model.associate(models, sequelize);
  }
}

sequelize.sync();

export default sequelize;
