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
    const values = data.map(log => {
      return [
        log.action_trace.trx_id,
        log.action_trace.act.data.obt_id,
        JSON.stringify({ ...log }),
      ];
    });

    const query =
      'INSERT INTO "wrap-status-fio-unwrap-nfts-logs" ("transactionId", "obtId", data) VALUES ' +
      data
        .map(() => {
          return '(?)';
        })
        .join(',') +
      ' ON CONFLICT ("transactionId") DO UPDATE SET "obtId" = EXCLUDED."obtId", data = EXCLUDED.data;';

    return this.sequelize.query(
      { query, values },
      { type: this.sequelize.QueryTypes.INSERT },
    );
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
