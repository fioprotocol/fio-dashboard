import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class GatedRegistrtionTokens extends Base {
  static init(sequelize) {
    super.init(
      {
        token: {
          type: DT.STRING,
          allowNull: false,
          unique: true,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'gated-registration-tokens',
        paranoid: true,
        timestamps: true,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['token', 'createdAt'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }
}
