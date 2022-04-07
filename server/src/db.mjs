import Sequelize from 'sequelize';

import config from './config';

import { User } from './models/User';
import { Action } from './models/Action';
import { Notification } from './models/Notification';
import { Nonce } from './models/Nonce';
import { FreeAddress } from './models/FreeAddress';
import { Wallet } from './models/Wallet';
import { ReferrerProfile } from './models/ReferrerProfile';
import { NewDeviceTwoFactor } from './models/NewDeviceTwoFactor';
import { Contact } from './models/Contact.mjs';
import { PublicWalletData } from './models/PublicWalletData.mjs';

const sequelize = new Sequelize(config.postgres);

User.init(sequelize);
Action.init(sequelize);
Notification.init(sequelize);
Nonce.init(sequelize);
FreeAddress.init(sequelize);
Wallet.init(sequelize);
ReferrerProfile.init(sequelize);
NewDeviceTwoFactor.init(sequelize);
Contact.init(sequelize);
PublicWalletData.init(sequelize);

const { models } = sequelize;

for (const modelName in models) {
  const model = models[modelName];
  if ('associate' in model) {
    model.associate(models, sequelize);
  }
}

sequelize.sync();

export default sequelize;
