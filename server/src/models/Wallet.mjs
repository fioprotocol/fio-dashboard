import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class Wallet extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        publicKey: { type: DT.STRING, allowNull: false },
        edgeId: { type: DT.STRING, allowNull: false, unique: true },
        name: { type: DT.STRING, allowNull: true },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wallets',
        paranoid: true,
        timestamps: false,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }

  static list(where) {
    return this.findAll({
      where,
    });
  }

  static format({ publicKey, edgeId, name, data }) {
    return {
      id: edgeId,
      publicKey,
      name,
      data,
    };
  }
}
