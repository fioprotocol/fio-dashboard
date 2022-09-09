import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioWrapNftsLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        transactionId: { type: DT.STRING, allowNull: false },
        address: { type: DT.STRING, allowNull: false },
        domain: { type: DT.STRING, allowNull: false },
        blockNumber: { type: DT.STRING, allowNull: false },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-fio-wrap-nft-logs',
        timestamps: false,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'transactionId', 'address', 'domain', 'blockNumber', 'data'],
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
          wf."domain", 
          wf."blockNumber", 
          wf."data", 
          wp."data" as "confirmData"
        FROM "wrap-status-fio-wrap-nft-logs" wf
          LEFT JOIN "wrap-status-polygon-wrap-logs" wp ON wp."obtId" = wf."transactionId"
        WHERE wf."transactionId" IS NOT NULL
        GROUP BY wf.id, wp.id
        ORDER BY wf."blockNumber"::bigint desc
        LIMIT ${limit} OFFSET ${offset}
      `);

    return actions;
  }
}
