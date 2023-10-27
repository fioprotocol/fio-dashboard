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
        isOldCart: { type: DT.BOOLEAN, defaultValue: false },
        userId: {
          type: DT.UUID,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'cascade',
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'cart',
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
      default: ['id', 'items', 'userId', 'isOldCart'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static format({ id, items, isOldCart }) {
    return { id, items, isOldCart };
  }
}
