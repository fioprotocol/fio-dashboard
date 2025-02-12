import Sequelize from 'sequelize';

import Base from './Base';
import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class ActionLimit extends Base {
  static get ACTION() {
    return {
      SEND_RECOVERY_EMAIL: 'SEND_RECOVERY_EMAIL',
    };
  }

  static init(sequelize) {
    super.init(
      {
        userId: {
          type: DT.UUID,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
          allowNull: true,
          primaryKey: true,
        },
        action: {
          type: DT.STRING,
          allowNull: false,
          primaryKey: true,
          comment: 'Type of action being limited',
        },
        count: {
          type: DT.INTEGER,
          allowNull: false,
          comment: 'Number of times action has been performed',
        },
        updatedAt: {
          type: DT.DATE,
          allowNull: false,
          comment: 'Timestamp of when the action was last performed',
        },
      },
      {
        sequelize,
        tableName: 'action-limit',
        timestamps: false,
        indexes: [
          {
            fields: ['userId', 'action'],
            unique: true,
            name: 'action_limit_user_action_unique',
          },
        ],
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
      default: ['userId', 'action', 'count', 'updatedAt'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async getByAction(userId, action) {
    return this.findOne({
      where: { userId, action },
    });
  }
}
