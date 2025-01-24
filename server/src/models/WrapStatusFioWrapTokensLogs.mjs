import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioWrapTokensLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        transactionId: { type: DT.STRING, primaryKey: true },
        address: { type: DT.STRING, allowNull: false },
        amount: { type: DT.STRING, allowNull: false },
        blockNumber: { type: DT.STRING, allowNull: false },
        oracleId: { type: DT.STRING },
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
      default: ['transactionId', 'address', 'amount', 'blockNumber', 'oracleId', 'data'],
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
    return this.sequelize.query(
      `
        SELECT 
          wf."transactionId", 
          wf.address, 
          wf."amount", 
          wf."blockNumber",
          wf."oracleId",
          wf."data", 
          we."data" as "confirmData",
          array_agg(wo."data") FILTER (WHERE wo."data" IS NOT NULL)  as "oravotes"
        FROM "wrap-status-fio-wrap-tokens-logs" wf
          LEFT JOIN "wrap-status-eth-wrap-logs" we ON (we."obtId" = wf."transactionId" OR we."obtId" = wf."oracleId")
          LEFT JOIN "wrap-status-eth-oracles-confirmations-logs" wo ON (wo."obtId" = wf."transactionId" OR wo."obtId" = wf."oracleId")
        WHERE wf."transactionId" IS NOT NULL
        GROUP BY wf."transactionId", we."transactionHash"
        ORDER BY wf."blockNumber"::bigint desc
        ${limit ? `LIMIT :limit` : ``} OFFSET :offset
      `,
      {
        replacements: { limit, offset },
        type: this.sequelize.QueryTypes.SELECT,
      },
    );
  }

  static async addLogs(data) {
    const records = data.map(log => ({
      transactionId: log.trx_id,
      address: log.act.data.public_address,
      amount: log.act.data.amount,
      blockNumber: log.block_num,
      oracleId: log.oracleId,
      data: log,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['address', 'amount', 'blockNumber', 'oracleId', 'data'],
    });
  }
}
