import Sequelize from 'sequelize';

import Base from './Base';
import { User } from './User';
import { ReferrerProfile } from './ReferrerProfile';
import { OrderItem } from './OrderItem';
import { Payment } from './Payment';

const { DataTypes: DT } = Sequelize;

export class Order extends Base {
  static get STATUS() {
    return {
      NEW: 1,
      PENDING: 2,
      PAYMENT_AWAITING: 3,
      PAID: 4,
      TRANSACTION_EXECUTED: 5,
      PARTIALLY_SUCCESS: 6,
      DONE: 7,
    };
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        total: { type: DT.STRING, allowNull: true, comment: 'Total cost' },
        roe: {
          type: DT.STRING,
          allowNull: false,
          comment: 'ROE value at the moment of order creation',
        },
        status: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
          comment:
            'Order status: NEW (1) , PENDING (2), PAYMENT_AWAITING (3), PAID (4), TRANSACTION_EXECUTED (5), PARTIALLY_SUCCESS (6), DONE (7)',
        },
        data: { type: DT.JSON, comment: 'Any additional data for the order' },
        publicKey: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Owner Wallet public key',
          defaultValue: null,
        },
        customerIp: {
          type: DT.STRING,
          allowNull: true,
          comment: 'IP Address of customer to limit free actions',
          defaultValue: null,
        },
      },
      {
        sequelize,
        tableName: 'orders',
        paranoid: true,
        indexes: [
          {
            fields: ['id'],
          },
          {
            fields: ['userId'],
          },
          {
            fields: ['refProfileId', 'publicKey', 'userId'],
          },
          {
            fields: ['status'],
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
    this.belongsTo(ReferrerProfile, {
      foreignKey: 'refProfileId',
      targetKey: 'id',
    });
    this.hasMany(OrderItem, {
      foreignKey: 'orderId',
      sourceKey: 'id',
    });
    this.hasMany(Payment, {
      foreignKey: 'orderId',
      sourceKey: 'id',
    });
  }

  static list(where) {
    return this.findAll({
      where,
      order: [['id', 'ASC']],
    });
  }

  static format({ id }) {
    return {
      id,
    };
  }
}
