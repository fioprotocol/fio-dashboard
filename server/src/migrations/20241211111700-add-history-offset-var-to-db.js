'use strict';

const path = require('path');
const { VARS_KEYS } = require(path.resolve(__dirname, '../config/constants.js'));

module.exports = {
  up: async QI => {
    return QI.bulkInsert('vars', [
      {
        key: VARS_KEYS.FIO_HISTORY_LIMIT,
        value: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async QI => {
    return QI.bulkDelete('vars', { key: VARS_KEYS.FIO_HISTORY_LIMIT });
  },
};
