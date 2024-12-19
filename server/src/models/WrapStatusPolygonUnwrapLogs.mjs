import Sequelize from 'sequelize';
import uniqBy from 'lodash/uniqBy';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusPolygonUnwrapLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        transactionHash: { type: DT.STRING, primaryKey: true },
        address: { type: DT.STRING, allowNull: false },
        blockNumber: { type: DT.STRING, allowNull: false },
        domain: { type: DT.STRING, allowNull: false },
        fioAddress: { type: DT.STRING, allowNull: false },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-polygon-unwrap-logs',
        timestamps: false,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'transactionHash',
        'address',
        'blockNumber',
        'domain',
        'fioAddress',
        'data',
      ],
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
          up."transactionHash", 
          up."blockNumber",
          up.address, 
          up."domain",
          up."fioAddress", 
          up."data", 
          array_agg(uf."data") FILTER (WHERE uf."data" IS NOT NULL)  as "confirmData",
          array_agg(uo."data") FILTER (WHERE uo."data" IS NOT NULL)  as "oravotes"
        FROM "wrap-status-polygon-unwrap-logs" up
          LEFT JOIN "wrap-status-fio-unwrap-nfts-logs" uf ON uf."obtId" = up."transactionHash"
          LEFT JOIN "wrap-status-fio-unwrap-nfts-oravotes" uo ON uo."obtId" = up."transactionHash"
        WHERE up."transactionHash" IS NOT NULL
        GROUP BY up."transactionHash"
        ORDER BY up."blockNumber"::bigint desc
        ${limit ? `LIMIT ${limit}` : ``} OFFSET ${offset}
      `);

    return actions.map(action => ({
      ...action,
      oravotes: uniqBy(action.oravotes, 'id'),
    }));
  }

  static async addLogs(data) {
    const records = data.map(log => ({
      transactionHash: log.transactionHash,
      address: log.address,
      blockNumber: log.blockNumber,
      domain: log.returnValues.domain,
      fioAddress: log.returnValues.fioaddress,
      data: log,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: [
        'transactionHash',
        'address',
        'blockNumber',
        'domain',
        'fioAddress',
        'data',
      ],
    });
  }
}
