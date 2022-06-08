import Sequelize from 'sequelize';

import Base from './Base';

import { USER_ROLES, USER_STATUS } from '../config/constants';
import { generateHash, compareHashString } from '../tools.mjs';

const { DataTypes: DT, Op } = Sequelize;

export class AdminUser extends Base {
  static get ROLE() {
    return {
      SUPER_ADMIN: USER_ROLES.SUPER_ADMIN,
      ADMIN: USER_ROLES.ADMIN,
    };
  }

  static get STATUS() {
    return USER_STATUS;
  }

  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.UUID,
          defaultValue: DT.UUIDV4,
          primaryKey: true,
        },
        email: { type: DT.STRING, unique: true },
        password: {
          type: DT.STRING,
          set(value) {
            const hashedPassword = generateHash(value);
            this.setDataValue('password', hashedPassword);
          },
        },
        status: {
          type: DT.ENUM,
          values: Object.values(this.STATUS),
          defaultValue: this.STATUS.NEW,
        },
        role: {
          type: DT.ENUM,
          values: Object.values(this.ROLE),
          defaultValue: this.ROLE.USER,
        },
      },
      {
        sequelize,
        tableName: 'admin-users',
        paranoid: true,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'email', 'status', 'role'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static findActive(id) {
    return this.findById(id, {
      where: { status: { [Op.ne]: this.STATUS.BLOCKED } },
    });
  }

  static info(id) {
    return this.findById(id);
  }

  static list() {
    return this.findAll({
      where: { role: { [Op.ne]: this.ROLE.SUPER_ADMIN } },
    });
  }

  checkPassword(password) {
    return compareHashString(password, this.get('password'));
  }
}
