import Sequelize from 'sequelize';
import Hashids from 'hashids';

import Base from './Base';
import { User } from './User';
import { FioAccountProfile } from './FioAccountProfile';

const { DataTypes: DT } = Sequelize;

const CODE_LENGTH = 5;
const CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const hashids = new Hashids(process.env.ORDER_NUMBER_SALT, CODE_LENGTH, CODE_ALPHABET);

export class ReferrerProfile extends Base {
  static get ACTION() {
    return {
      SIGNNFT: 'SIGNNFT',
    };
  }

  static get TYPE() {
    return {
      REF: 'REFERRER',
      AFFILIATE: 'AFFILIATE',
    };
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        type: { type: DT.STRING, defaultValue: this.TYPE.REF },
        code: { type: DT.STRING, allowNull: false, unique: true },
        regRefCode: { type: DT.STRING, allowNull: false },
        label: { type: DT.STRING, allowNull: true },
        title: { type: DT.STRING, allowNull: true },
        subTitle: { type: DT.STRING, allowNull: true },
        tpid: { type: DT.STRING, allowNull: true },
        settings: { type: DT.JSON },
        // Possible settings keys:
        // settings: {
        //   domains: ['refprofile'],
        //   premiumDomains: ['refprofile'],
        //   allowCustomDomain: false,
        //   actions: {"SIGNNFT": {title: '', subtitle: ''}, "REG": {title: '', subtitle: ''}},
        //   img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3A/wD/A...',
        //   link: 'https://www.ref.profile/',
        //   simpleRegLogo: '/ref/logos/simple-reg-ref-profile-log.png',
        //   cryptoHandleSalePrice: 1.22,
        //   cryptoHandleSaleRoeActive: false,
        //   domainSalePrice: 33,
        //   domainSaleRoeActive: true,
        //   auto_bundles: false,
        // },
        simpleRegEnabled: { type: DT.BOOLEAN, defaultValue: false },
        simpleRegIpWhitelist: {
          type: DT.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        apiWebhook: {
          type: DT.STRING,
          allowNull: true,
        },
        apiToken: {
          type: DT.STRING,
          allowNull: true,
        },
        freeFioAccountProfileId: {
          type: DT.BIGINT,
          allowNull: true,
          defaultValue: 1,
        },
        paidFioAccountProfileId: {
          type: DT.BIGINT,
          allowNull: true,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: 'referrer-profiles',
        paranoid: true,
      },
    );
  }

  static associate() {
    this.hasMany(User, {
      foreignKey: 'refProfileId',
      sourceKey: 'id',
      as: 'refProfile',
    });
    this.belongsTo(FioAccountProfile, {
      foreignKey: 'freeFioAccountProfileId',
      targetKey: 'id',
    });
    this.belongsTo(FioAccountProfile, {
      foreignKey: 'paidFioAccountProfileId',
      targetKey: 'id',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'id',
        'type',
        'code',
        'regRefCode',
        'freeFioAccountProfileId',
        'paidFioAccountProfileId',
        'label',
        'title',
        'subTitle',
        'tpid',
        'settings',
        'createdAt',
      ],
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

  static format({
    id,
    type,
    code,
    regRefCode,
    freeFioAccountProfileId,
    paidFioAccountProfileId,
    label,
    title,
    subTitle,
    settings,
    tpid,
  }) {
    return {
      id,
      type,
      code,
      regRefCode,
      freeFioAccountProfileId,
      paidFioAccountProfileId,
      label,
      title,
      subTitle,
      settings,
      tpid,
    };
  }

  static list(limit = 25, offset = 0, where) {
    return this.findAll({
      order: [['createdAt', 'DESC']],
      limit: limit ? limit : undefined,
      offset,
      where,
    });
  }

  static partnersCount(where) {
    return this.count({
      where,
    });
  }

  static generateCode(data) {
    return hashids.encode(data).toLowerCase();
  }
}
