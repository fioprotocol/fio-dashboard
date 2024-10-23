import Sequelize from 'sequelize';

import Base from './Base';
import { ReferrerProfile } from './ReferrerProfile.mjs';

import { FIO_ACCOUNT_TYPES } from '../config/constants';

const { DataTypes: DT, Op } = Sequelize;

export class FioAccountProfile extends Base {
  static get ACCOUNT_TYPE() {
    return FIO_ACCOUNT_TYPES;
  }

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
        accountType: {
          type: DT.STRING,
          allowNull: true,
          defaultValue: null,
          unique: true,
        },
        domains: {
          type: DT.ARRAY(DT.STRING),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'fio-account-profiles',
        paranoid: true,
        getterMethods: {
          referenceToPartners() {
            // Check if this FioAccountProfile id exists in ReferrerProfile table
            return sequelize.models.ReferrerProfile.findOne({
              where: {
                [Op.or]: [
                  { freeFioAccountProfileId: this.id },
                  { paidFioAccountProfileId: this.id },
                ],
              },
            }).then(result => !!result);
          },
        },
      },
    );
  }

  static associate() {
    this.hasMany(ReferrerProfile, {
      foreignKey: 'freeFioAccountProfileId',
      sourceKey: 'id',
    });
    this.hasMany(ReferrerProfile, {
      foreignKey: 'paidFioAccountProfileId',
      sourceKey: 'id',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'id',
        'actor',
        'permission',
        'name',
        'domains',
        'accountType',
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

  static async getDomainOwner(domain) {
    const domainOwner = await this.findOne({
      where: {
        domains: {
          [Op.contains]: [domain],
        },
      },
    });
    return domainOwner ? this.format(domainOwner) : null;
  }

  static async getFreePaidItems() {
    const freeAndPaidFioAccountProfiles =
      (await this.findAll({
        order: [['createdAt', 'DESC']],
        [Op.and]: [
          {
            accountType: FIO_ACCOUNT_TYPES.FREE,
          },
          {
            accountType: FIO_ACCOUNT_TYPES.FREE_FALLBACK,
          },
          {
            accountType: FIO_ACCOUNT_TYPES.PAID,
          },
          {
            accountType: FIO_ACCOUNT_TYPES.PAID_FALLBACK,
          },
        ],
      })) || [];

    return freeAndPaidFioAccountProfiles.map(freeAndPaidFioAccountProfile =>
      this.format(freeAndPaidFioAccountProfile),
    );
  }

  static accountsProfilesCount() {
    return this.count();
  }

  static async list(limit = 25, offset = 0) {
    const fioAccountProfiles = await this.findAll({
      order: [['createdAt', 'DESC']],
      limit: limit ? limit : undefined,
      offset,
    });

    const fioAccountProfileJSONs = await Promise.all(
      fioAccountProfiles.map(async fioAccountProfile => {
        const fioAccountProfileJSON = fioAccountProfile.toJSON();
        fioAccountProfileJSON.referenceToPartners = await fioAccountProfile.referenceToPartners;
        return fioAccountProfileJSON;
      }),
    );

    return fioAccountProfileJSONs;
  }

  static format({ id, name, actor, permission, domains, accountType }) {
    return {
      id,
      name,
      actor,
      permission,
      domains,
      accountType,
    };
  }
}
