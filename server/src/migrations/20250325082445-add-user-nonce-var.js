'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      INSERT INTO vars(key, value, "createdAt", "updatedAt")
      VALUES ('USER_NONCE_LIMIT', '20', now(), now());
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      DELETE FROM vars WHERE "key" = 'USER_NONCE_LIMIT';
    `);
  },
};
