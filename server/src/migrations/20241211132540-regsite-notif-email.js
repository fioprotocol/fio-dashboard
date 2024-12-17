'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      INSERT INTO vars(key, value, "createdAt", "updatedAt")
      VALUES ('REGSITE_NOTIF_EMAIL', 'example@test.com', now(), now());
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      DELETE FROM vars WHERE "key" = 'REGSITE_NOTIF_EMAIL';
    `);
  },
};
