'use strict';

module.exports = {
  up: async QI => {
    const [results] = await QI.sequelize.query(
      `SELECT id FROM vars WHERE "key" = 'MAX_CONTACTS_PER_USER';`,
    );
    if (results.length > 0) return;

    await QI.sequelize.query(`
      INSERT INTO vars(key, value, "createdAt", "updatedAt")
      VALUES ('MAX_CONTACTS_PER_USER', '2000', now(), now());
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      DELETE FROM vars WHERE "key" = 'MAX_CONTACTS_PER_USER';
    `);
  },
};
