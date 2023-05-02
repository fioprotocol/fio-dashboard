'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(QI) {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET "freeFioAccountProfileId" = (
        SELECT "id" FROM "fio-account-profiles"
        WHERE "accountType" = 'FREE'
        LIMIT 1
      )
      WHERE "type" = 'REFERRER' AND "freeFioAccountProfileId" IS NULL;
    `);

    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET "paidFioAccountProfileId" = (
        SELECT "id" FROM "fio-account-profiles"
        WHERE "accountType" = 'PAID'
        LIMIT 1
      )
      WHERE "type" = 'REFERRER' AND "paidFioAccountProfileId" IS NULL;
    `);
  },
  down: async () => {
    //no way back
  },
};
