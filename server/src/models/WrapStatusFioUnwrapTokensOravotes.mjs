import Sequelize from 'sequelize';

import Base from './Base';

import { WrapStatusFioUnwrapTokensLogs as WrapStatusFioUnwrapTokensLogsModel } from './WrapStatusFioUnwrapTokensLogs.mjs';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioUnwrapTokensOravotes extends Base {
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
        tableName: 'wrap-status-fio-unwrap-tokens-oravotes',
        timestamps: false,
      },
    );
  }

  static associate() {
    this.hasMany(WrapStatusFioUnwrapTokensLogsModel, {
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

  static format({
    attempts,
    id,
    obtId,
    isComplete,
    data,
    WrapStatusFioUnwrapTokensLogs,
  }) {
    return {
      attempts,
      id,
      obtId,
      isComplete,
      data,
      WrapStatusFioUnwrapTokensLogs:
        WrapStatusFioUnwrapTokensLogs && WrapStatusFioUnwrapTokensLogs.length
          ? WrapStatusFioUnwrapTokensLogs.map(wrapStatusFioUnwrapTokensItem =>
              WrapStatusFioUnwrapTokensLogsModel.format(wrapStatusFioUnwrapTokensItem),
            )
          : [],
    };
  }
}
