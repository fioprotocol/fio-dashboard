'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.createTable('referrer-profiles', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      code: { type: DT.STRING, allowNull: false, unique: true },
      regRefCode: { type: DT.STRING, allowNull: false },
      regRefApiToken: { type: DT.STRING, allowNull: false },
      label: { type: DT.STRING, allowNull: true },
      title: { type: DT.STRING, allowNull: true },
      subTitle: { type: DT.STRING, allowNull: true },
      tpid: { type: DT.STRING, allowNull: true },
      settings: { type: DT.JSON },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });
  },

  down: async QI => {
    return QI.dropTable('referrer-profiles');
  },
};
