'use strict';

const config = require('../config/constants');

module.exports = {
  up: async QI => {
    return QI.removeColumn('users', 'role');
  },

  down: async (QI, DT) => {
    return await QI.addColumn('users', 'role', {
      type: DT.STRING,
      defaultValue: config.USER_ROLES.USER,
    });
  },
};
