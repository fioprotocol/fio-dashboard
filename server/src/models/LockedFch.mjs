import Sequelize from 'sequelize';

import Base from './Base';
import { User } from './User';

import { EXPIRED_LOCKED_PERIOD } from '../config/constants';

const { DataTypes: DT } = Sequelize;

export class LockedFch extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        fch: { type: DT.STRING, allowNull: false, comment: 'Twitter fch' },
        userId: {
          type: DT.UUID,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
          allowNull: true,
          comment: 'If we locked fch been logged in',
        },
        token: {
          type: DT.STRING,
          allowNull: true,
        },
        createdAt: { type: DT.DATE },
        updatedAt: { type: DT.DATE },
        deletedAt: { type: DT.DATE },
      },
      {
        sequelize,
        tableName: 'locked-fch',
        paranoid: true,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'lockedFch',
    });
  }

  static async getItem(where) {
    const lockedFch = await this.findOne({
      where: { ...where },
    });

    return lockedFch ? this.format(lockedFch.get({ plain: true })) : null;
  }

  static format({ createdAt, fch, id, token, userId }) {
    return {
      createdAt,
      fch,
      id,
      token,
      userId,
    };
  }

  static async deleteLockedFch(where, opt = {}) {
    return await this.destroy({
      where,
      force: true,
      ...opt,
    });
  }

  static async isExpired(lokedFchItem) {
    const expiredTime =
      new Date(lokedFchItem.createdAt).getTime() + EXPIRED_LOCKED_PERIOD;
    if (expiredTime > new Date().getTime()) return false;

    await this.deleteLockedFch({ id: lokedFchItem.id });
    return true;
  }
}
