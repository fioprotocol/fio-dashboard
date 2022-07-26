import Sequelize from 'sequelize';

import Base from './Base.mjs';
import { ChainCode } from './ChainCode.mjs';

const { DataTypes: DT } = Sequelize;

export class TokenCode extends Base {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        chainCodeId: {
          type: DT.STRING,
        },
        tokenCodeId: {
          type: DT.STRING,
        },
        tokenCodeName: { type: DT.STRING },
      },
      {
        sequelize,
        tableName: 'token-codes-list',
        timestamps: false,
      },
    );
  }

  static associate() {
    this.belongsTo(ChainCode, {
      foreignKey: 'chainCodeId',
      targetKey: 'chainCodeId',
      as: 'tokens',
    });
  }

  static format(tokenCodeItem) {
    delete tokenCodeItem.id;
    return tokenCodeItem;
  }
}
