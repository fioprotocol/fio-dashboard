'use strict';

const { ADMIN_STATUS_IDS } = require('../config/constants');

module.exports = {
  up: async (QI, DT) => {
    return QI.sequelize.transaction(async t => {
      await QI.createTable(
        'admin-users-statuses',
        {
          id: {
            type: DT.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          status: {
            type: DT.STRING,
            unique: true,
            allowNull: false,
          },
        },
        { transaction: t },
      );

      await QI.bulkInsert(
        'admin-users-statuses',
        [
          { status: 'NEW', id: ADMIN_STATUS_IDS.NEW },
          { status: 'ACTIVE', id: ADMIN_STATUS_IDS.ACTIVE },
          { status: 'BLOCKED', id: ADMIN_STATUS_IDS.BLOCKED },
          {
            status: 'NEW_EMAIL_NOT_VERIFIED',
            id: ADMIN_STATUS_IDS.NEW_EMAIL_NOT_VERIFIED,
          },
        ],
        { transaction: t },
      );

      await QI.addColumn(
        'admin-users',
        'statusId',
        {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
          references: {
            model: 'admin-users-statuses',
            key: 'id',
          },
          onDelete: 'cascade',
        },
        { transaction: t },
      );

      await QI.removeColumn('admin-users', 'status', { transaction: t });
    });
  },

  down: async (QI, DT) => {
    await QI.removeColumn('admin-users', 'statusId');
    await QI.dropTable('admin-users-statuses');
    return QI.addColumn('admin-users', 'status', {
      type: DT.STRING,
      defaultValue: ADMIN_STATUS_IDS.NEW,
    });
  },
};
