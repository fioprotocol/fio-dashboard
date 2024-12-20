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
        oracleId: { type: DT.STRING },
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
      default: ['transactionId', 'address', 'domain', 'blockNumber', 'oracleId', 'data'],
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
          wf."oracleId",
          wf."data", 
          wp."data" as "confirmData",
          array_agg(wo."data") FILTER (WHERE wo."data" IS NOT NULL)  as "oravotes"
        FROM "wrap-status-fio-wrap-nft-logs" wf
          LEFT JOIN "wrap-status-polygon-wrap-logs" wp ON (wp."obtId" = wf."transactionId" OR wp."obtId" = wf."oracleId")
          LEFT JOIN "wrap-status-polygon-oracles-confirmations-logs" wo ON (wo."obtId" = wf."transactionId" OR wo."obtId" = wf."oracleId")
        WHERE wf."transactionId" IS NOT NULL
        GROUP BY wf."transactionId", wp."transactionHash"
        ORDER BY wf."blockNumber"::bigint desc
       ${limit ? `LIMIT ${limit}` : ``} OFFSET ${offset}
      `);

    return actions;
  }

  static async addLogs(data) {
    const records = data.map(log => ({
      transactionId: log.trx_id,
      address: log.act.data.public_address,
      domain: log.act.data.fio_domain,
      blockNumber: log.block_num,
      oracleId: log.oracleId,
      data: log,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['address', 'domain', 'blockNumber', 'oracleId', 'data'],
    });
  }
}
