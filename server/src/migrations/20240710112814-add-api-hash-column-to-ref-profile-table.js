'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('referrer-profiles', 'apiHash', {
      type: DT.STRING,
      allowNull: true,
    });

    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET "apiHash" = "apiToken"
    `);
  },

  down: async QI => {
    await QI.removeColumn('referrer-profiles', 'apiHash');
  },
};
