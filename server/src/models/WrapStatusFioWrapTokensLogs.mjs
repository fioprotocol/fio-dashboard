import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioWrapTokensLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        transactionId: { type: DT.STRING, allowNull: false },
        address: { type: DT.STRING, allowNull: false },
        amount: { type: DT.STRING, allowNull: false },
        blockNumber: { type: DT.STRING, allowNull: false },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-fio-wrap-tokens-logs',
        timestamps: false,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'transactionId', 'address', 'amount', 'blockNumber', 'data'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static actionsCount() {
    return this.count();
  }

  static async listWithConfirmation(limit, offset) {
    const [actions] = await this.sequelize.query(`
        SELECT 
          wf.id, 
          wf."transactionId", 
          wf.address, 
          wf."amount", 
          wf."blockNumber", 
          wf."data", 
          we."data" as "confirmData"
        FROM "wrap-status-fio-wrap-tokens-logs" wf
          LEFT JOIN "wrap-status-eth-wrap-logs" we ON we."obtId" = wf."transactionId"
        WHERE wf."transactionId" IS NOT NULL
        GROUP BY wf.id, we.id
        ORDER BY wf."blockNumber"::bigint desc
        LIMIT ${limit} OFFSET ${offset}
      `);

    return actions;
  }
}
