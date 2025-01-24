import Sequelize from 'sequelize';
import uniqBy from 'lodash/uniqBy';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusEthUnwrapLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        transactionHash: { type: DT.STRING, primaryKey: true },
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
        'transactionHash',
        'address',
        'blockNumber',
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
    const actions = await this.sequelize.query(
      `
        SELECT 
          ue."transactionHash", 
          ue."blockNumber",
          ue.address, 
          ue."amount",
          ue."fioAddress", 
          ue."data", 
          array_agg(uf."data") FILTER (WHERE uf."data" IS NOT NULL)  as "confirmData",
          array_agg(uo."data") FILTER (WHERE uo."data" IS NOT NULL)  as "oravotes"
        FROM "wrap-status-eth-unwrap-logs" ue
          LEFT JOIN "wrap-status-fio-unwrap-tokens-logs" uf ON uf."obtId" = ue."transactionHash"
          LEFT JOIN "wrap-status-fio-unwrap-tokens-oravotes" uo ON uo."obtId" = ue."transactionHash"
        WHERE ue."transactionHash" IS NOT NULL
        GROUP BY ue."transactionHash"
        ORDER BY ue."blockNumber"::bigint desc
        ${limit ? `LIMIT :limit` : ``} OFFSET :offset
      `,
      {
        replacements: { limit, offset },
        type: this.sequelize.QueryTypes.SELECT,
      },
    );

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
      amount: log.returnValues.amount,
      fioAddress: log.returnValues.fioaddress,
      data: log,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['address', 'blockNumber', 'amount', 'fioAddress', 'data'],
    });
  }
}
