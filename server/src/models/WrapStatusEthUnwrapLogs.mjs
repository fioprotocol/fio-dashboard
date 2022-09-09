import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusEthUnwrapLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        transactionHash: { type: DT.STRING, allowNull: false },
        address: { type: DT.STRING, allowNull: false },
        blockNumber: { type: DT.STRING, allowNull: false },
        amount: { type: DT.STRING, allowNull: false },
        fioAddress: { type: DT.STRING, allowNull: false },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-eth-unwrap-logs',
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
        'amount',
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
          ue.id, 
          ue."transactionHash", 
          ue."blockNumber",
          ue.address, 
          ue."amount",
          ue."fioAddress", 
          ue."data", 
          uf."data" as "confirmData"
        FROM "wrap-status-eth-unwrap-logs" ue
          LEFT JOIN "wrap-status-fio-unwrap-tokens-logs" uf ON uf."obtId" = ue."transactionHash"
        WHERE ue."transactionHash" IS NOT NULL
        GROUP BY ue.id, uf.id
        ORDER BY ue."blockNumber"::bigint desc
        LIMIT ${limit} OFFSET ${offset}
      `);

    return actions;
  }
}
