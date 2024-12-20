import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusEthWrapLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        transactionHash: { type: DT.STRING, primaryKey: true },
        obtId: { type: DT.STRING, allowNull: false },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-eth-wrap-logs',
        timestamps: false,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['transactionHash', 'obtId', 'data'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async addLogs(data) {
    const records = data.map(log => ({
      transactionHash: log.transactionHash,
      obtId: log.returnValues.obtid,
      data: log,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['obtId', 'data'],
    });
  }
}
