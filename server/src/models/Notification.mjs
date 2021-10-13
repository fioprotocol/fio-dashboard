import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

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
        title: { type: DT.STRING, allowNull: true },
        message: { type: DT.TEXT },
        seenDate: { type: DT.DATE, allowNull: true },
        closeDate: { type: DT.DATE, allowNull: true },
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

  static format({
    id,
    type,
    action,
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
      title,
      message,
      seenDate,
      closeDate,
      createdAt,
      pagesToShow: data && (data.pagesToShow || null),
    };
  }
}
