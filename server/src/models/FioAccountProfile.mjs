import Sequelize from 'sequelize';

import Base from './Base';
import { ReferrerProfile } from './ReferrerProfile.mjs';

const { DataTypes: DT } = Sequelize;

export class FioAccountProfile extends Base {
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
        isDefault: {
          type: DT.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
      default: ['id', 'actor', 'permission', 'name', 'isDefault', 'createdAt'],
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

  static getDefault() {
    return this.getItem({ isDefault: true });
  }

  static accountsProfilesCount() {
    return this.count();
  }

  static list(limit = 25, offset = 0) {
    return this.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  static format({ id, name, actor, permission, isDefault }) {
    return {
      id,
      name,
      actor,
      permission,
      isDefault,
    };
  }
}
