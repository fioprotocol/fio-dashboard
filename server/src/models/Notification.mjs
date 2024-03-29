import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';
import getNotificationContent from '../notifications.mjs';

const { DataTypes: DT } = Sequelize;

export class Notification extends Base {
  static get TYPE() {
    return {
      WARNING: 'warning',
      ALERT: 'alert',
      ERROR: 'error',
      INFO: 'info',
      SUCCESS: 'success',
    };
  }
  static get CONTENT_TYPE() {
    return {
      ACCOUNT_CONFIRMATION: 'ACCOUNT_CONFIRMATION',
      ACCOUNT_CREATE: 'ACCOUNT_CREATE',
      BALANCE_CHANGED: 'BALANCE_CHANGED',
      NEW_FIO_REQUEST: 'NEW_FIO_REQUEST',
      FIO_REQUEST_REJECTED: 'FIO_REQUEST_REJECTED',
      FIO_REQUEST_APPROVED: 'FIO_REQUEST_APPROVED',
      DOMAIN_EXPIRE: 'DOMAIN_EXPIRE',
      LOW_BUNDLE_TX: 'LOW_BUNDLE_TX',
      PURCHASE_CONFIRMATION: 'PURCHASE_CONFIRMATION',
    };
  }
  static get EMAIL_CONTENT_TYPES() {
    return [
      this.CONTENT_TYPE.DOMAIN_EXPIRE,
      this.CONTENT_TYPE.LOW_BUNDLE_TX,
      this.CONTENT_TYPE.BALANCE_CHANGED,
      this.CONTENT_TYPE.NEW_FIO_REQUEST,
      this.CONTENT_TYPE.FIO_REQUEST_APPROVED,
      this.CONTENT_TYPE.FIO_REQUEST_REJECTED,
      this.CONTENT_TYPE.PURCHASE_CONFIRMATION,
    ];
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        type: { type: DT.STRING, allowNull: false },
        action: { type: DT.STRING, allowNull: true },
        contentType: { type: DT.STRING, allowNull: true },
        title: { type: DT.STRING, allowNull: true },
        message: { type: DT.TEXT },
        seenDate: { type: DT.DATE, allowNull: true },
        closeDate: { type: DT.DATE, allowNull: true },
        emailDate: { type: DT.DATE, allowNull: true },
        data: { type: DT.JSON },
        attempts: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'notifications',
        paranoid: true,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }

  static list(where, order, limit = null) {
    if (!order) order = [['createdAt', 'DESC']];
    return this.findAll({
      where: { closeDate: null, ...where },
      order,
      limit,
    });
  }

  static getItem(where) {
    return this.findOne({
      where: { ...where },
    });
  }

  static getDefaultContent(contentType, key) {
    if (getNotificationContent()[contentType]) {
      return getNotificationContent()[contentType][key];
    }
    return null;
  }

  static format({
    id,
    type,
    action,
    contentType,
    title,
    message,
    seenDate,
    closeDate,
    data,
    createdAt,
  }) {
    return {
      id,
      type,
      action,
      contentType,
      title: title || this.getDefaultContent(contentType, 'title'),
      message: message || this.getDefaultContent(contentType, 'message'),
      seenDate,
      closeDate,
      createdAt,
      pagesToShow: data && (data.pagesToShow || null),
    };
  }
}
