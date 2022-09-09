import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioUnwrapNftsLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        obtId: { type: DT.STRING, allowNull: false },
        isComplete: { type: DT.BOOLEAN, defaultValue: false },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-fio-unwrap-nfts-logs',
        timestamps: false,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'obtId', 'isComplete', 'data'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }
}
