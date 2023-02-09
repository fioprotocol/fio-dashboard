import Sequelize from 'sequelize';

import Base from './Base';
import { ReferrerProfile } from './ReferrerProfile.mjs';

import { FIO_ACCOUNT_TYPES } from '../config/constants';

const { DataTypes: DT } = Sequelize;

export class FioAccountProfile extends Base {
  static get ACCOUNT_TYPE() {
    return FIO_ACCOUNT_TYPES;
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        actor: {
          type: DT.STRING,
          allowNull: false,
        },
        permission: {
          type: DT.STRING,
          allowNull: false,
        },
        name: {
          type: DT.STRING,
          allowNull: true,
        },
        accountType: {
          type: DT.STRING,
          allowNull: true,
          defaultValue: null,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: 'fio-account-profiles',
        paranoid: true,
      },
    );
  }

  static associate() {
    this.hasMany(ReferrerProfile, {
      foreignKey: 'fioAccountProfileId',
      sourceKey: 'id',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'actor', 'permission', 'name', 'accountType', 'createdAt'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static getItem(where) {
    return this.findOne({
      where: { ...where },
    });
  }

  static getPaid() {
    return this.getItem({ accountType: FIO_ACCOUNT_TYPES.PAID });
  }

  static accountsProfilesCount() {
    return this.count();
  }

  static list(limit = 25, offset = 0) {
    return this.findAll({
      order: [['createdAt', 'DESC']],
      limit: limit ? limit : undefined,
      offset,
    });
  }

  static format({ id, name, actor, permission, accountType }) {
    return {
      id,
      name,
      actor,
      permission,
      accountType,
    };
  }
}
