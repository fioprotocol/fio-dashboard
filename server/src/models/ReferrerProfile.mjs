import Sequelize from 'sequelize';

import Base from './Base';
import { User } from './User';
import { FioAccountProfile } from './FioAccountProfile';

const { DataTypes: DT } = Sequelize;

export class ReferrerProfile extends Base {
  static get ACTION() {
    return {
      SIGNNFT: 'SIGNNFT',
    };
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        code: { type: DT.STRING, allowNull: false, unique: true },
        regRefCode: { type: DT.STRING, allowNull: false },
        regRefApiToken: { type: DT.STRING, allowNull: false },
        label: { type: DT.STRING, allowNull: true },
        title: { type: DT.STRING, allowNull: true },
        subTitle: { type: DT.STRING, allowNull: true },
        tpid: { type: DT.STRING, allowNull: true },
        settings: { type: DT.JSON },
        // Possible settings keys:
        // settings: {
        //   domains: ['refprofile'],
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
      foreignKey: 'fioAccountProfileId',
      targetKey: 'id',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'id',
        'code',
        'label',
        'title',
        'subTitle',
        'tpid',
        'settings',
        'regRefApiToken',
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

  static format({ id, code, regRefCode, label, title, subTitle, settings, tpid }) {
    return {
      id,
      code,
      regRefCode,
      label,
      title,
      subTitle,
      settings,
      tpid,
    };
  }

  static list(limit = 25, offset = 0) {
    return this.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  static partnersCount() {
    return this.count();
  }
}
