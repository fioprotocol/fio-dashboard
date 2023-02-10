'use strict';

const { FIO_ACCOUNT_TYPES } = require('../config/constants');

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('fio-account-profiles', 'accountType', {
      type: DT.STRING,
      defaultValue: null,
      allowNull: true,
      unique: true,
    });

    await QI.sequelize.query(
      `update public."fio-account-profiles" set "accountType" = '${FIO_ACCOUNT_TYPES.PAID}' WHERE "isDefault" = 'true'`,
    );

    await QI.removeColumn('fio-account-profiles', 'isDefault');
  },

  down: async (QI, DT) => {
    await QI.addColumn('fio-account-profiles', 'isDefault', {
      type: DT.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await QI.sequelize.query(
      `update public."fio-account-profiles" set "isDefault" = 'true' WHERE "accountType" = '${FIO_ACCOUNT_TYPES.PAID}'`,
    );

    await QI.removeColumn('fio-account-profiles', 'accountType');
  },
};
