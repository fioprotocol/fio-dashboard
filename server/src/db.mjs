import Sequelize from 'sequelize';
import config from './config';

import { User } from './models/User';
import { Action } from './models/Action';

const sequelize = new Sequelize(config.postgres);

User.init(sequelize);
Action.init(sequelize);

const { models } = sequelize;

for (const modelName in models) {
  const model = models[modelName];
  if ('associate' in model) {
    model.associate(models, sequelize);
  }
}

sequelize.sync();

export default sequelize;
