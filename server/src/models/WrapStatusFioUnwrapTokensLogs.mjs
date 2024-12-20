import Sequelize from 'sequelize';

import Base from './Base';

import { WrapStatusFioUnwrapTokensOravotes } from './WrapStatusFioUnwrapTokensOravotes.mjs';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioUnwrapTokensLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        transactionId: { type: DT.STRING, primaryKey: true },
        obtId: { type: DT.STRING, allowNull: false },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-fio-unwrap-tokens-logs',
        timestamps: false,
      },
    );
  }

  static associate() {
    this.belongsTo(WrapStatusFioUnwrapTokensOravotes, {
      foreignKey: 'obtId',
      targetKey: 'obtId',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['transactionId', 'obtId', 'data'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async addLogs(data) {
    const records = data.map(log => ({
      transactionId: log.trx_id,
      obtId: log.act.data.obt_id,
      data: log,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['obtId', 'data'],
    });
  }

  static format({ data, obtId, transactionId }) {
    return {
      data,
      obtId,
      transactionId,
    };
  }
}
