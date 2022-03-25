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
      RECOVERY_PASSWORD: 'RECOVERY_PASSWORD',
      ACCOUNT_CONFIRMATION: 'ACCOUNT_CONFIRMATION',
      ACCOUNT_CREATE: 'ACCOUNT_CREATE',
      BALANCE_CHANGED: 'BALANCE_CHANGED',
      NEW_FIO_REQUEST: 'NEW_FIO_REQUEST',
      FIO_REQUEST_REJECTED: 'FIO_REQUEST_REJECTED',
      FIO_REQUEST_APPROVED: 'FIO_REQUEST_APPROVED',
      DOMAIN_EXPIRE: 'DOMAIN_EXPIRE',
      LOW_BUNDLE_TX: 'LOW_BUNDLE_TX',
    };
  }
  static get ACTION() {
    return {
      RECOVERY: 'RECOVERY',
    };
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
