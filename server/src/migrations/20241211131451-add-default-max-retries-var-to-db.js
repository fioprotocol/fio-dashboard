'use strict';

const path = require('path');
const { VARS_KEYS } = require(path.resolve(__dirname, '../config/constants.js'));

module.exports = {
  up: async QI => {
    return QI.bulkInsert('vars', [
      {
        key: VARS_KEYS.DEFAULT_MAX_RETRIES,
        value: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async QI => {
    return QI.bulkDelete('vars', { key: VARS_KEYS.DEFAULT_MAX_RETRIES });
  },
};
