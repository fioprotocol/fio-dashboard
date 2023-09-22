import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioWrapNftsLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        transactionId: { type: DT.STRING, primaryKey: true },
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
      default: ['transactionId', 'address', 'domain', 'blockNumber', 'data'],
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
          wf."domain", 
          wf."blockNumber", 
          wf."data", 
          wp."data" as "confirmData",
          array_agg(wo."data") FILTER (WHERE wo."data" IS NOT NULL)  as "oravotes"
        FROM "wrap-status-fio-wrap-nft-logs" wf
          LEFT JOIN "wrap-status-polygon-wrap-logs" wp ON wp."obtId" = wf."transactionId"
          LEFT JOIN "wrap-status-polygon-oracles-confirmations-logs" wo ON wo."obtId" = wf."transactionId"
        WHERE wf."transactionId" IS NOT NULL
        GROUP BY wf."transactionId", wp."transactionHash"
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
        log.action_trace.act.data.fio_domain,
        log.block_num,
        JSON.stringify({ ...log }),
      ];
    });

    const query =
      'INSERT INTO "wrap-status-fio-wrap-nft-logs" ("transactionId", address, domain, "blockNumber", data) VALUES ' +
      data
        .map(() => {
          return '(?)';
        })
        .join(',') +
      ' ON CONFLICT ("transactionId") DO UPDATE SET address = EXCLUDED.address, domain = EXCLUDED.domain, "blockNumber" = EXCLUDED."blockNumber", data = EXCLUDED.data;';

    return this.sequelize.query(
      { query, values },
      { type: this.sequelize.QueryTypes.INSERT },
    );
  }
}
