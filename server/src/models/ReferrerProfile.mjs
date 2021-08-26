import Sequelize from 'sequelize';

import Base from './Base';

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
        settings: { type: DT.JSON }, // { domains, allowCustomDomain, actions }
      },
      {
        sequelize,
        tableName: 'referrer-profiles',
        paranoid: true,
      },
    );
  }

  static getItem(where) {
    return this.findOne({
      where: { ...where },
    });
  }

  static format({ id, code, regRefCode, label, title, subTitle, settings }) {
    return {
      id,
      code,
      regRefCode,
      label,
      title,
      subTitle,
      settings,
    };
  }
}
