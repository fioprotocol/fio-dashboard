'use strict';

const path = require('path');
const { VARS_KEYS } = require(path.resolve(__dirname, '../config/constants.js'));

module.exports = {
  up: async QI => {
    return QI.bulkInsert('vars', [
      {
        key: VARS_KEYS.API_URLS_BLOCKED,
        value: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async QI => {
    return QI.bulkDelete('vars', { key: VARS_KEYS.API_URLS_BLOCKED });
  },
};
