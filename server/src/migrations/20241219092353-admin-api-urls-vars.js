'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      INSERT INTO vars(key, value, "createdAt", "updatedAt")
      VALUES ('API_URLS_MIN_VERSION', '3.5.1', now(), now());
    `);
    await QI.sequelize.query(`
      INSERT INTO vars(key, value, "createdAt", "updatedAt")
      VALUES ('API_URLS_DYNAMIC_FETCH', '0', now(), now());
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      DELETE FROM vars WHERE "key" = 'API_URLS_MIN_VERSION' OR "key" = 'API_URLS_DYNAMIC_FETCH';
    `);
  },
};
