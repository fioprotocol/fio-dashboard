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
      default: ['transactionId', 'address', 'amount', 'blockNumber', 'data'],
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
          wf."transactionId", 
          wf.address, 
          wf."amount", 
          wf."blockNumber", 
          wf."data", 
          we."data" as "confirmData",
          array_agg(wo."data") FILTER (WHERE wo."data" IS NOT NULL)  as "oravotes"
        FROM "wrap-status-fio-wrap-tokens-logs" wf
          LEFT JOIN "wrap-status-eth-wrap-logs" we ON we."obtId" = wf."transactionId"
          LEFT JOIN "wrap-status-eth-oracles-confirmations-logs" wo ON wo."obtId" = wf."transactionId"
        WHERE wf."transactionId" IS NOT NULL
        GROUP BY wf."transactionId", we."transactionHash"
        ORDER BY wf."blockNumber"::bigint desc
        ${limit ? `LIMIT ${limit}` : ``} OFFSET ${offset}
      `);

    return actions;
  }

  static async addLogs(data) {
    const values = data.map(log => {
      return [
        log.action_trace.trx_id,
        log.action_trace.act.data.public_address,
        log.action_trace.act.data.amount,
        log.block_num,
        JSON.stringify({ ...log }),
      ];
    });

    const query =
      'INSERT INTO "wrap-status-fio-wrap-tokens-logs" ("transactionId", address, amount, "blockNumber", data) VALUES ' +
      data
        .map(() => {
          return '(?)';
        })
        .join(',') +
      ' ON CONFLICT ("transactionId") DO UPDATE SET address = EXCLUDED.address, amount = EXCLUDED.amount, "blockNumber" = EXCLUDED."blockNumber", data = EXCLUDED.data;';

    return this.sequelize.query(
      { query, values },
      { type: this.sequelize.QueryTypes.INSERT },
    );
  }
}
