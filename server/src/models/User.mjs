import Sequelize from 'sequelize';
import fiojs from '@fioprotocol/fiojs';

import Base from './Base';
import { Notification } from './Notification';
import { Nonce } from './Nonce';
import { FreeAddress } from './FreeAddress';
import { Wallet } from './Wallet';
import { NewDeviceTwoFactor } from './NewDeviceTwoFactor';
import { ReferrerProfile } from './ReferrerProfile';
import { Order } from './Order';
import { LockedFch } from './LockedFch.mjs';
import { DomainsWatchlist } from './DomainsWatchlist.mjs';

import { USER_STATUS } from '../config/constants';

import { convertToNewDate } from '../utils/general.mjs';

const { DataTypes: DT, Op } = Sequelize;

export class User extends Base {
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
        username: { type: DT.STRING, unique: true },
        status: {
          type: DT.ENUM,
          values: Object.values(this.STATUS),
          defaultValue: this.STATUS.NEW,
        },
        avatar: DT.STRING,
        location: DT.STRING,
        secretSet: DT.BOOLEAN,
        refProfileId: { type: DT.BIGINT, allowNull: true },
        affiliateProfileId: { type: DT.BIGINT, allowNull: true },
        timeZone: { type: DT.STRING, defaultValue: 'America/New_York' },
        isOptIn: { type: DT.BOOLEAN, defaultValue: false },
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
    this.hasMany(NewDeviceTwoFactor, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'newDeviceTwoFactor',
    });
    this.hasMany(Order, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'orders',
    });
    this.belongsTo(ReferrerProfile, {
      foreignKey: 'refProfileId',
      targetKey: 'id',
      as: 'refProfile',
    });
    this.belongsTo(ReferrerProfile, {
      foreignKey: 'affiliateProfileId',
      targetKey: 'id',
      as: 'affiliateProfile',
    });
    this.hasMany(LockedFch, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'lockedFch',
    });
    this.hasMany(DomainsWatchlist, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'domainsWatchlist',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'id',
        'username',
        'email',
        'status',
        'avatar',
        'location',
        'secretSet',
        'freeAddresses',
        'fioWallets',
        'newDeviceTwoFactor',
        'refProfile',
        'affiliateProfile',
        'createdAt',
        'timeZone',
        'orders',
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
        {
          model: NewDeviceTwoFactor,
          as: 'newDeviceTwoFactor',
          attributes: ['id', 'voucherId', 'deviceDescription', 'createdAt', 'status'],
        },
        { model: ReferrerProfile, as: 'refProfile', attributes: ['code'] },
        { model: ReferrerProfile, as: 'affiliateProfile', attributes: ['code', 'tpid'] },
      ],
    });
  }

  static findDeletedUser() {
    return this.findOne({
      where: {
        username: 'DELETEDUSER',
      },
    });
  }

  static findUser(id) {
    return this.findById(id, {
      include: [
        { model: FreeAddress, as: 'freeAddresses' },
        { model: Wallet, as: 'fioWallets' },
        { model: ReferrerProfile, as: 'refProfile', attributes: ['code'] },
        {
          model: ReferrerProfile,
          as: 'affiliateProfile',
          attributes: ['code', 'tpid'],
        },
        { model: Order, as: 'orders' },
      ],
    });
  }

  static info(id) {
    return this.findById(id);
  }

  static usersCount() {
    return this.count();
  }

  static list(limit = 25, offset, include) {
    const params = {
      order: [['createdAt', 'DESC']],
      offset,
    };

    if (limit && Number(limit) > 0) params.limit = limit;
    if (include) params.include = include;

    return this.findAll(params);
  }

  static async formatDateWithTimeZone(id, date = undefined) {
    const user = await this.findById(id);

    return (date ? convertToNewDate(date) : new Date()).toLocaleDateString([], {
      timeZone: user.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  }
}
