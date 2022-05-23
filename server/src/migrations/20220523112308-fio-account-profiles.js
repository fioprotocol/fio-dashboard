'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('fio-account-profiles', {
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
      isDefault: {
        type: DT.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    await QI.sequelize.query(
      `INSERT INTO "fio-account-profiles" ( id, name, actor, permission, "isDefault", "createdAt", "updatedAt" ) VALUES (1, 'Default', '', '', TRUE, NOW(), NOW())`,
    );
  },

  down: async QI => {
    return QI.dropTable('fio-account-profiles');
  },
};
