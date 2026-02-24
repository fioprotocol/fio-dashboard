'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      INSERT INTO vars(key, value, "createdAt", "updatedAt")
      VALUES ('MAX_DOMAINS_WATCHLIST_PER_USER', '150', now(), now());
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      DELETE FROM vars WHERE "key" = 'MAX_DOMAINS_WATCHLIST_PER_USER';
    `);
  },
};
