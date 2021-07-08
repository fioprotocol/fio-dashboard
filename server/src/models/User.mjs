import Sequelize from 'sequelize';
import fiojs from '@fioprotocol/fiojs';

import Base from './Base';
import { Notification } from './Notification';
import { Nonce } from './Nonce';
import { FreeAddress } from './FreeAddress';
import { Wallet } from './Wallet';

const { DataTypes: DT, Op } = Sequelize;

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
        username: { type: DT.STRING, unique: true },
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

  static associate() {
    this.hasMany(Nonce, { foreignKey: 'userId', sourceKey: 'id' });
    this.hasMany(Notification, { foreignKey: 'userId', sourceKey: 'id' });
    this.hasMany(Wallet, { foreignKey: 'userId', sourceKey: 'id', as: 'fioWallets' });
    this.hasMany(FreeAddress, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'freeAddresses',
    });
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
        'freeAddresses',
        'fioWallets',
      ],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static verify(challenge, publicKey, signature) {
    return fiojs.Ecc.verify(signature, challenge, publicKey);
  }

  static findActive(id) {
    return this.findById(id, {
      where: { status: { [Op.ne]: this.STATUS.BLOCKED } },
      include: [
        { model: FreeAddress, as: 'freeAddresses' },
        { model: Wallet, as: 'fioWallets' },
      ],
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
