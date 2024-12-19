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
    const records = data.map(log => ({
      id: log.id,
      obtId: log.obt_id,
      isComplete: !!log.isComplete,
      data: log,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['obtId', 'isComplete', 'data'],
    });
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
