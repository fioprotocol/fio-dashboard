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
    const values = data.map(log => {
      return [
        log.action_trace.trx_id,
        log.action_trace.act.data.obt_id,
        JSON.stringify({ ...log }),
      ];
    });

    const query =
      'INSERT INTO "wrap-status-fio-unwrap-tokens-logs" ("transactionId", "obtId", data) VALUES ' +
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

  static format({ data, obtId, transactionId }) {
    return {
      data,
      obtId,
      transactionId,
    };
  }
}
