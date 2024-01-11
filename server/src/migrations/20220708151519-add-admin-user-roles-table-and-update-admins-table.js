'use strict';

const { ADMIN_ROLES_IDS } = require('../config/constants');

module.exports = {
  up: async (QI, DT) => {
    return QI.sequelize.transaction(async t => {
      await QI.createTable(
        'admin-users-roles',
        {
          id: {
            type: DT.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          role: {
            type: DT.STRING,
            unique: true,
            allowNull: false,
          },
        },
        { transaction: t },
      );

      await QI.bulkInsert(
        'admin-users-roles',
        [
          { role: 'ADMIN', id: ADMIN_ROLES_IDS.ADMIN },
          { role: 'SUPERADMIN', id: ADMIN_ROLES_IDS.SUPER_ADMIN },
        ],
        { transaction: t },
      );

      await QI.addColumn(
        'admin-users',
        'tfaSecret',
        {
          type: DT.STRING,
          allowNull: true,
        },
        { transaction: t },
      );

      await QI.addColumn(
        'admin-users',
        'roleId',
        {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
          references: {
            model: 'admin-users-roles',
            key: 'id',
          },
          onDelete: 'cascade',
        },
        { transaction: t },
      );

      await QI.removeColumn('admin-users', 'role', { transaction: t });
    });
  },

  down: async (QI, DT) => {
    await QI.removeColumn('admin-users', 'roleId');
    await QI.removeColumn('admin-users', 'tfaSecret');
    await QI.dropTable('admin-users-roles');
    return QI.addColumn('admin-users', 'role', {
      type: DT.STRING,
      defaultValue: ADMIN_ROLES_IDS.ADMIN,
    });
  },
};
