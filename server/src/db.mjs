import Sequelize from 'sequelize';

import config from './config';

import { Action } from './models/Action';
import { AdminUser } from './models/AdminUser.mjs';
import { AdminUsersRole } from './models/AdminUsersRole.mjs';
import { AdminUsersStatus } from './models/AdminUsersStatus.mjs';
import { BlockchainTransaction } from './models/BlockchainTransaction.mjs';
import { BlockchainTransactionEventLog } from './models/BlockchainTransactionEventLog.mjs';
import { Cart } from './models/Cart.mjs';
import { ChainCode } from './models/ChainCode.mjs';
import { Contact } from './models/Contact.mjs';
import { Domain } from './models/Domain.mjs';
import { DomainsWatchlist } from './models/DomainsWatchlist.mjs';
import { FioAccountProfile } from './models/FioAccountProfile';
import { FioApiUrl } from './models/FioApiUrl';
import { FreeAddress } from './models/FreeAddress';
import { GatedRegistrtionTokens } from './models/GatedRegistrationTokens.mjs';
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
import { SearchTerm } from './models/SearchTerm.mjs';
import { TokenCode } from './models/TokenCode.mjs';
import { User } from './models/User';
import { Username } from './models/Username.mjs';
import { Var } from './models/Var.mjs';
import { Wallet } from './models/Wallet';
import { WrapStatusBlockNumbers } from './models/WrapStatusBlockNumbers.mjs';
import { WrapStatusEthOraclesConfirmationsLogs } from './models/WrapStatusEthOraclesConfirmationsLogs.mjs';
import { WrapStatusEthUnwrapLogs } from './models/WrapStatusEthUnwrapLogs.mjs';
import { WrapStatusEthWrapLogs } from './models/WrapStatusEthWrapLogs.mjs';
import { WrapStatusFioUnwrapNftsLogs } from './models/WrapStatusFioUnwrapNftsLogs.mjs';
import { WrapStatusFioUnwrapNftsOravotes } from './models/WrapStatusFioUnwrapNftsOravotes.mjs';
import { WrapStatusFioUnwrapTokensLogs } from './models/WrapStatusFioUnwrapTokensLogs.mjs';
import { WrapStatusFioUnwrapTokensOravotes } from './models/WrapStatusFioUnwrapTokensOravotes.mjs';
import { WrapStatusFioWrapNftsLogs } from './models/WrapStatusFioWrapNftsLogs.mjs';
import { WrapStatusFioWrapTokensLogs } from './models/WrapStatusFioWrapTokensLogs.mjs';
import { WrapStatusNetworks } from './models/WrapStatusNetworks.mjs';
import { WrapStatusPolygonOraclesConfirmationsLogs } from './models/WrapStatusPolygonOraclesConfirmationsLogs.mjs';
import { WrapStatusPolygonUnwrapLogs } from './models/WrapStatusPolygonUnwrapLogs.mjs';
import { WrapStatusPolygonWrapLogs } from './models/WrapStatusPolygonWrapLogs.mjs';

const sequelize = new Sequelize(config.postgres);

Action.init(sequelize);
AdminUsersRole.init(sequelize);
AdminUsersStatus.init(sequelize);
AdminUser.init(sequelize);
BlockchainTransactionEventLog.init(sequelize);
BlockchainTransaction.init(sequelize);
Cart.init(sequelize);
ChainCode.init(sequelize);
Contact.init(sequelize);
DomainsWatchlist.init(sequelize);
Domain.init(sequelize);
FioAccountProfile.init(sequelize);
FioApiUrl.init(sequelize);
FreeAddress.init(sequelize);
GatedRegistrtionTokens.init(sequelize);
LockedFch.init(sequelize);
NewDeviceTwoFactor.init(sequelize);
Nonce.init(sequelize);
Notification.init(sequelize);
OrderItemStatus.init(sequelize);
OrderItem.init(sequelize);
Order.init(sequelize);
PaymentEventLog.init(sequelize);
Payment.init(sequelize);
PublicWalletData.init(sequelize);
ReferrerProfile.init(sequelize);
SearchTerm.init(sequelize);
TokenCode.init(sequelize);
Username.init(sequelize);
User.init(sequelize);
Var.init(sequelize);
Wallet.init(sequelize);
WrapStatusBlockNumbers.init(sequelize);
WrapStatusEthOraclesConfirmationsLogs.init(sequelize);
WrapStatusEthUnwrapLogs.init(sequelize);
WrapStatusEthWrapLogs.init(sequelize);
WrapStatusFioUnwrapNftsLogs.init(sequelize);
WrapStatusFioUnwrapNftsOravotes.init(sequelize);
WrapStatusFioUnwrapTokensLogs.init(sequelize);
WrapStatusFioUnwrapTokensOravotes.init(sequelize);
WrapStatusFioWrapNftsLogs.init(sequelize);
WrapStatusFioWrapTokensLogs.init(sequelize);
WrapStatusNetworks.init(sequelize);
WrapStatusPolygonOraclesConfirmationsLogs.init(sequelize);
WrapStatusPolygonUnwrapLogs.init(sequelize);
WrapStatusPolygonWrapLogs.init(sequelize);

const { models } = sequelize;

for (const modelName in models) {
  const model = models[modelName];
  if ('associate' in model) {
    model.associate(models, sequelize);
  }
}

sequelize.sync();

export default sequelize;
