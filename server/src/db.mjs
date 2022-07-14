import Sequelize from 'sequelize';

import config from './config';

import { User } from './models/User';
import { Action } from './models/Action';
import { Notification } from './models/Notification';
import { Nonce } from './models/Nonce';
import { FreeAddress } from './models/FreeAddress';
import { Wallet } from './models/Wallet';
import { ReferrerProfile } from './models/ReferrerProfile';
import { FioAccountProfile } from './models/FioAccountProfile';
import { NewDeviceTwoFactor } from './models/NewDeviceTwoFactor';
import { Contact } from './models/Contact.mjs';
import { PublicWalletData } from './models/PublicWalletData.mjs';
import { Order } from './models/Order.mjs';
import { OrderItem } from './models/OrderItem.mjs';
import { OrderItemStatus } from './models/OrderItemStatus.mjs';
import { BlockchainTransaction } from './models/BlockchainTransaction.mjs';
import { BlockchainTransactionEventLog } from './models/BlockchainTransactionEventLog.mjs';
import { Payment } from './models/Payment.mjs';
import { PaymentEventLog } from './models/PaymentEventLog.mjs';
import { Var } from './models/Var.mjs';
import { AdminUser } from './models/AdminUser.mjs';
import { AdminUsersRole } from './models/AdminUsersRole.mjs';
import { AdminUsersStatus } from './models/AdminUsersStatus.mjs';

const sequelize = new Sequelize(config.postgres);

User.init(sequelize);
Action.init(sequelize);
Notification.init(sequelize);
Nonce.init(sequelize);
FreeAddress.init(sequelize);
Wallet.init(sequelize);
ReferrerProfile.init(sequelize);
FioAccountProfile.init(sequelize);
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

const { models } = sequelize;

for (const modelName in models) {
  const model = models[modelName];
  if ('associate' in model) {
    model.associate(models, sequelize);
  }
}

sequelize.sync();

export default sequelize;
