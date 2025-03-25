'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      INSERT INTO vars(key, value, "createdAt", "updatedAt")
      VALUES ('SET_WALLETS_LIMIT', '50', now(), now()),
      ('SET_WALLETS_AMOUNT', '200', now(), now());
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      DELETE FROM vars WHERE "key" = 'SET_WALLETS_LIMIT' OR "key" = 'SET_WALLETS_AMOUNT';
    `);
  },
};
