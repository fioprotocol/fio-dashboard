import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioBurnedDomainsLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        transactionId: { type: DT.STRING, primaryKey: true },
        domain: { type: DT.STRING, allowNull: false },
        blockNumber: { type: DT.STRING, allowNull: false },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-fio-burned-domains-logs',
        timestamps: false,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['transactionId', 'domain', 'blockNumber', 'data'],
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
          wfb."transactionId",
          wfb."domain",
          wfb."blockNumber",
          wfb."data",
          wp."data" as "confirmData",
          array_agg(wo."data") FILTER (WHERE wo."data" IS NOT NULL)  as "oravotes"
        FROM "wrap-status-fio-burned-domains-logs" wfb
          LEFT JOIN "wrap-status-polygon-burned-domains-logs" wp
            ON wp."obtId" = wfb."transactionId"
            OR wp."domain" = wfb."domain"
          LEFT JOIN "wrap-status-polygon-oracles-confirmations-logs" wo
            ON wo."obtId" = wfb."transactionId"
            OR wo."domain" = wfb."domain"
        WHERE wfb."transactionId" IS NOT NULL
        GROUP BY wfb."transactionId", wp."transactionHash"
        ORDER BY wfb."blockNumber"::bigint desc
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
      domain: log.data.name,
      blockNumber: log.block_num,
      data: log,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['domain', 'blockNumber', 'data'],
    });
  }
}
