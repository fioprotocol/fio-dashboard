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

  static getItem(where) {
    return this.findOne({
      where: { ...where },
    });
  }

  static getDefault() {
    return this.getItem({ isDefault: true });
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
