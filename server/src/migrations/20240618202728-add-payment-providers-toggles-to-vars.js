'use strict';

const path = require('path');
const { VARS_KEYS } = require(path.resolve(__dirname, '../config/constants.js'));

module.exports = {
  up: async QI => {
    return QI.bulkInsert('vars', [
      {
        key: VARS_KEYS.FORMS_OF_PAYMENT,
        value: JSON.stringify({ stripe: true, stripeAffiliate: true, bitpay: true }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async QI => {
    return QI.bulkDelete('vars', { key: VARS_KEYS.FORMS_OF_PAYMENT });
  },
};
