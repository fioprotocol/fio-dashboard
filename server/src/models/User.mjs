import Sequelize from 'sequelize';
import fiojs from '@fioprotocol/fiojs';
import { findTimeZone } from 'timezone-support';

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

import { USER_STATUS, USER_PROFILE_TYPE } from '../config/constants';

import { convertToNewDate } from '../utils/general.mjs';

const { DataTypes: DT, Op } = Sequelize;

export class User extends Base {
  static get STATUS() {
    return USER_STATUS;
  }

  static get USER_PROFILE_TYPE() {
    return USER_PROFILE_TYPE;
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
        emailNotificationParams: {
          type: DT.JSON,
          defaultValue: {
            fioDomainExpiration: true,
            fioRequest: true,
            fioBalanceChange: true,
            lowBundles: true,
          },
          allowNull: false,
        },
        userProfileType: {
          type: DT.STRING,
          defaultValue: this.USER_PROFILE_TYPE.PRIMARY,
        },
        freeId: {
          type: DT.STRING,
          allowNull: true,
          defaultValue: null,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
      },
    );
  }

  static associate() {
    this.hasMany(Nonce, { foreignKey: 'userId', sourceKey: 'id' });
    this.hasMany(Notification, { foreignKey: 'userId', sourceKey: 'id' });
    this.hasMany(Wallet, { foreignKey: 'userId', sourceKey: 'id', as: 'fioWallets' });
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
        'refProfileId',
        'affiliateProfile',
        'createdAt',
        'timeZone',
        'orders',
        'emailNotificationParams',
        'userProfileType',
        'freeId',
      ],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static verify({ challenge, publicKey, signature }) {
    return fiojs.Ecc.verify(signature, challenge, publicKey);
  }

  static async findActive(id) {
    const user = await this.findByPk(id, {
      raw: true,
      where: { status: { [Op.ne]: this.STATUS.BLOCKED } },
    });

    if (!user) return null;

    return user;
  }

  static async getInfo(id) {
    const user = await this.findByPk(id, {
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
        {
          model: ReferrerProfile,
          as: 'affiliateProfile',
          attributes: ['code', 'tpid', 'settings'],
        },
      ],
    });

    if (!user) return null;

    const walletPublicKeys = user.fioWallets.map(wallet => wallet.publicKey);
    const freeAddresses = await FreeAddress.findAll({
      where: {
        publicKey: {
          [Op.in]: walletPublicKeys,
        },
      },
    });

    user.dataValues.freeAddresses = [...user.freeAddresses, ...freeAddresses];

    return user;
  }

  static findDeletedUser() {
    return this.findOne({
      where: {
        username: 'DELETEDUSER',
      },
    });
  }

  static async findUser(id) {
    const user = await this.findByPk(id, {
      include: [
        { model: FreeAddress, as: 'freeAddresses' },
        { model: Wallet, as: 'fioWallets' },
        { model: ReferrerProfile, as: 'refProfile', attributes: ['code'] },
        {
          model: ReferrerProfile,
          as: 'affiliateProfile',
          attributes: ['code', 'tpid'],
        },
      ],
    });

    if (!user) return null;

    const walletPublicKeys = user.fioWallets.map(wallet => wallet.publicKey);
    const freeAddresses = await FreeAddress.findAll({
      where: {
        publicKey: {
          [Op.in]: walletPublicKeys,
        },
      },
    });

    user.freeAddresses = [...user.freeAddresses, ...freeAddresses];

    // Need to get orders separately because of sequelize bad performance if user has a lot of orders
    const orders = await Order.findAll({ where: { userId: user.id } });

    const userObj = user.json();

    if (orders) {
      userObj.orders = orders;
    }

    return userObj;
  }

  static info(id) {
    return this.findByPk(id);
  }

  static usersCount({ where, include }) {
    return this.count({ distinct: true, where, include, col: 'id' });
  }

  static list({ limit = 25, offset, include, where }) {
    const params = {
      order: [['createdAt', 'DESC']],
      offset,
      where,
    };

    if (limit && Number(limit) > 0) params.limit = limit;
    if (include) params.include = include;

    return this.findAll(params);
  }

  static async formatDateWithTimeZone(id, date = undefined) {
    const user = await this.findByPk(id);

    const currentDate = date ? convertToNewDate(date) : new Date();

    const timeZone = user.timeZone
      ? findTimeZone(user.timeZone)
      : { name: Intl.DateTimeFormat().resolvedOptions().timeZone };

    return currentDate.toLocaleDateString([], {
      timeZone: timeZone.name,
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
