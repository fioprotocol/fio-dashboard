import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusNetworks extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DT.STRING },
      },
      {
        sequelize,
        tableName: 'wrap-status-networks',
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'name'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async getNetworkByName(name) {
    return this.findOne({ where: { name } });
  }
}
