import Sequelize from 'sequelize';
import crypto from 'crypto';

import Base from './Base';

const { DataTypes: DT, Op } = Sequelize;

import config from '../config';

export class User extends Base {
  static get ROLE() {
    return {
      USER: 'USER',
      ADMIN: 'ADMIN',
    };
  }

  static get STATUS() {
    return {
      NEW: 'NEW',
      ACTIVE: 'ACTIVE',
      BLOCKED: 'BLOCKED',
    };
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
        username: DT.STRING,
        password: {
          type: DT.STRING,
          set(value) {
            this.setDataValue('password', User.generateHash(value));
          },
        },
        pin: {
          type: DT.STRING,
          set(value) {
            this.setDataValue('pin', User.generateHash(value));
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
        avatar: DT.STRING,
        location: DT.STRING,
        secretSet: DT.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'users',
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'id',
        'username',
        'email',
        'status',
        'role',
        'avatar',
        'location',
        'secretSet',
      ],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  checkPassword(password) {
    return this.get('password') === User.generateHash(password);
  }

  checkPin(pin) {
    return this.get('pin') === User.generateHash(pin);
  }

  static generateHash(string) {
    return crypto
      .createHmac('sha256', config.secret)
      .update(string)
      .digest('hex');
  }

  static findActive(id) {
    return this.findById(id, {
      where: { status: { [Op.ne]: this.STATUS.BLOCKED } },
    });
  }

  static info(id) {
    return this.findById(id, {
      where: { role: { [Op.ne]: this.ROLE.ADMIN } },
    });
  }

  static list() {
    return this.findAll({
      where: { role: { [Op.ne]: this.ROLE.ADMIN } },
    });
  }
}
