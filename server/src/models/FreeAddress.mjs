import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class FreeAddress extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DT.STRING, allowNull: false },
        freeId: {
          type: DT.STRING,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize,
        tableName: 'free-addresses',
        paranoid: true,
        indexes: [
          {
            fields: ['freeId'],
            using: 'BTREE',
          },
        ],
      },
    );
  }

  static async getItems(params) {
    const { userId, publicKey, freeId, name } = params;
    const where = {};
    if (name) where.name = name;
    if (freeId) where.freeId = freeId;

    if (userId) {
      const { freeId } = await User.findOne({ where: { id: userId }, raw: true });
      where.freeId = freeId;
    }

    if (publicKey) {
      where.freeId = publicKey; // no profile flow
    }

    return this.findAll({ where });
  }

  static format({ id, name, publicKey, createdAt, freeId }) {
    return {
      id,
      name,
      publicKey,
      createdAt,
      freeId,
    };
  }

  static formatMinimal({ name }) {
    return { name };
  }
}
