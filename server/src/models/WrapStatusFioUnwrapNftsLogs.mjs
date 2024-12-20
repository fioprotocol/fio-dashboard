import Sequelize from 'sequelize';

import Base from './Base';

import { WrapStatusFioUnwrapNftsOravotes } from './WrapStatusFioUnwrapNftsOravotes.mjs';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioUnwrapNftsLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        transactionId: { type: DT.STRING, primaryKey: true },
        obtId: { type: DT.STRING, allowNull: false },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-fio-unwrap-nfts-logs',
        timestamps: false,
      },
    );
  }

  static associate() {
    this.belongsTo(WrapStatusFioUnwrapNftsOravotes, {
      foreignKey: 'obtId',
      targetKey: 'obtId',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['transactionId', 'obtId', 'blockNumber', 'data'],
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

  static format({ blockNumber, data, obtId, transactionId }) {
    return {
      blockNumber,
      data,
      obtId,
      transactionId,
    };
  }
}
