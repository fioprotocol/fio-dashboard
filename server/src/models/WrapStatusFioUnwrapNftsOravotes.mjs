import Sequelize from 'sequelize';

import Base from './Base';

import { WrapStatusFioUnwrapNftsLogs as WrapStatusFioUnwrapNftsLogsModel } from './WrapStatusFioUnwrapNftsLogs.mjs';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioUnwrapNftsOravotes extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true },
        obtId: { type: DT.STRING, allowNull: false },
        isComplete: { type: DT.BOOLEAN, defaultValue: false },
        data: { type: DT.JSON },
        attempts: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'wrap-status-fio-unwrap-nfts-oravotes',
        timestamps: false,
      },
    );
  }

  static associate() {
    this.hasMany(WrapStatusFioUnwrapNftsLogsModel, {
      foreignKey: 'obtId',
      sourceKey: 'obtId',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['attempts', 'id', 'obtId', 'isComplete', 'data'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async addLogs(data) {
    const values = data.map(log => {
      return [log.id, log.obt_id, !!log.isComplete, JSON.stringify({ ...log })];
    });

    const query =
      'INSERT INTO "wrap-status-fio-unwrap-nfts-oravotes" ("id", "obtId", "isComplete", data) VALUES ' +
      data
        .map(() => {
          return '(?)';
        })
        .join(',') +
      ' ON CONFLICT ("id") DO UPDATE SET "obtId" = EXCLUDED."obtId", "isComplete" = EXCLUDED."isComplete", data = EXCLUDED.data;';

    return this.sequelize.query(
      { query, values },
      { type: this.sequelize.QueryTypes.INSERT },
    );
  }

  static format({ attempts, id, obtId, isComplete, data, WrapStatusFioUnwrapNftsLogs }) {
    return {
      attempts,
      id,
      obtId,
      isComplete,
      data,
      WrapStatusFioUnwrapNftsLogs:
        WrapStatusFioUnwrapNftsLogs && WrapStatusFioUnwrapNftsLogs.length
          ? WrapStatusFioUnwrapNftsLogs.map(wrapStatusFioUnwrapTokensItem =>
              WrapStatusFioUnwrapNftsLogsModel.format(wrapStatusFioUnwrapTokensItem),
            )
          : [],
    };
  }
}
