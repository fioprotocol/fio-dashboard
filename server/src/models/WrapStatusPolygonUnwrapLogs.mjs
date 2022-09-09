import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusPolygonUnwrapLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        transactionHash: { type: DT.STRING, allowNull: false },
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
        'id',
        'blockNumber',
        'transactionHash',
        'address',
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
          up.id, 
          up."transactionHash", 
          up."blockNumber",
          up.address, 
          up."domain",
          up."fioAddress", 
          up."data", 
          uf."data" as "confirmData"
        FROM "wrap-status-polygon-unwrap-logs" up
          LEFT JOIN "wrap-status-fio-unwrap-nfts-logs" uf ON uf."obtId" = up."transactionHash"
        WHERE up."transactionHash" IS NOT NULL
        GROUP BY up.id, uf.id
        ORDER BY up."blockNumber"::bigint desc
        LIMIT ${limit} OFFSET ${offset}
      `);

    return actions;
  }
}
