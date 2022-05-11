import Sequelize from 'sequelize';

import { FIO_ACTIONS } from '../config/constants.js';

import Base from './Base';
import { Order } from './Order';
import { BlockchainTransaction } from './BlockchainTransaction';
import { OrderItemStatus } from './OrderItemStatus';

const { DataTypes: DT } = Sequelize;

export class OrderItem extends Base {
  static get ACTION() {
    return FIO_ACTIONS;
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        action: {
          type: DT.STRING,
          allowNull: false,
          comment:
            'FIO API action. registerFioAddress / renewFioDomain / addBundledTransactions etc',
        },
        address: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Crypto Handle name, optional',
          defaultValue: null,
        },
        domain: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Crypto handle domain, optional',
          defaultValue: null,
        },
        params: { type: DT.JSON, comment: 'Params needed for the action' },
        nativeFio: { type: DT.STRING, allowNull: true, comment: 'Item price in FIO' },
        price: {
          type: DT.STRING,
          allowNull: true,
          comment: 'Item price in priceCurrency',
        },
        priceCurrency: {
          type: DT.STRING,
          allowNull: true,
          comment: 'USDC, ETH, ...',
          defaultValue: 'USDC',
        },
        data: { type: DT.JSON, comment: 'Any additional data for the item' },
      },
      {
        sequelize,
        tableName: 'order-items',
        paranoid: true,
        indexes: [
          {
            fields: ['id'],
          },
          {
            fields: ['action'],
          },
          {
            fields: ['address', 'domain'],
          },
          {
            fields: ['orderId'],
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(Order, {
      foreignKey: 'orderId',
      targetKey: 'id',
    });
    this.hasMany(BlockchainTransaction, {
      foreignKey: 'orderItemId',
      sourceKey: 'id',
    });
    this.hasOne(OrderItemStatus, {
      foreignKey: 'orderItemId',
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
