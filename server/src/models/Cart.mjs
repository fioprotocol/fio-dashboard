import Sequelize from 'sequelize';

import Base from './Base.mjs';

import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class Cart extends Base {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        items: {
          type: DT.JSON,
        },
        userId: {
          type: DT.UUID,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'cascade',
          allowNull: true,
        },
        metamaskUserPublicKey: {
          type: DT.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'cart',
        timestamps: true,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'items', 'metamaskUserPublicKey', 'userId'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static format({ id, items, metamaskUserPublicKey }) {
    return { id, items, metamaskUserPublicKey };
  }
}
