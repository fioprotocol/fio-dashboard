import Sequelize from 'sequelize';

import Base from './Base';
import { Payment } from './Payment.mjs';

import { PAYMENT_EVENT_STATUSES } from '../config/constants.js';

const { DataTypes: DT } = Sequelize;

export class PaymentEventLog extends Base {
  static get STATUS() {
    return PAYMENT_EVENT_STATUSES;
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        status: {
          type: DT.INTEGER,
          defaultValue: 1,
          comment:
            'PENDING (2) / SUCCESS (3) / REVIEW (4) / CANCEL (5). A "REVIEW" is a system or payment anomaly.',
        },
        statusNotes: { type: DT.STRING, comment: 'Status details' },
        data: { type: DT.JSON, comment: 'Any additional data for the item' },
      },
      {
        sequelize,
        tableName: 'payment-event-logs',
        paranoid: true,
        indexes: [
          {
            fields: ['status'],
          },
          {
            fields: ['paymentId'],
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(Payment, {
      foreignKey: 'paymentId',
      targetKey: 'id',
    });
  }

  static list(where) {
    return this.findAll({
      where,
      order: [['id', 'ASC']],
    });
  }

  static format({ id, status, statusNotes, createdAt, updatedAt }) {
    return {
      id,
      status,
      statusNotes,
      createdAt,
      updatedAt,
    };
  }
}
