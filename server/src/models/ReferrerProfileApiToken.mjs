import Sequelize from 'sequelize';

import Base from './Base';
import { ReferrerProfile } from './ReferrerProfile.mjs';

const { DataTypes: DT } = Sequelize;

export class ReferrerProfileApiToken extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        token: { type: DT.STRING, allowNull: true },
        access: { type: DT.BOOLEAN, defaultValue: true },
        legacyHash: { type: DT.STRING, allowNull: true },
        dailyFreeLimit: { type: DT.INTEGER, allowNull: true },
        lastNotificationDate: { type: DT.DATE, allowNull: true },
      },
      {
        sequelize,
        tableName: 'referrer-profile-api-tokens',
      },
    );
  }

  static associate() {
    this.belongsTo(ReferrerProfile, {
      foreignKey: 'refProfileId',
      targetKey: 'id',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'token', 'access', 'legacyHash', 'dailyFreeLimit', 'createdAt'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static format({
    id,
    token,
    access,
    legacyHash,
    dailyFreeLimit,
    lastNotificationDate,
    createdAt,
  }) {
    return {
      id,
      token,
      access,
      legacyHash,
      dailyFreeLimit,
      lastNotificationDate,
      createdAt,
    };
  }
}
