import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class WrapStatusFioHistoryOffsetParams extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        accountName: { type: DT.STRING, allowNull: false },
        accountActionSequence: { type: DT.INTEGER, defaultValue: 0 },
        createdAt: { type: DT.DATE },
        updatedAt: { type: DT.DATE },
      },
      {
        sequelize,
        tableName: 'wrap-status-fio-history-offset-params',
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'accountName', 'accountActionSequence'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async getAccountActionSequence({ accountName }) {
    const data = await this.find({ where: { accountName } });
    return parseInt(data.accountActionSequence);
  }

  static async setActionSequence({ accountName, accountActionSequenceValue }) {
    return WrapStatusFioHistoryOffsetParams.update(
      { accountActionSequence: accountActionSequenceValue },
      { where: { accountName } },
    );
  }
}
