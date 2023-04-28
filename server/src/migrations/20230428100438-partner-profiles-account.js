'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE "referrer-profiles"
      SET "freeFioAccountProfileId" = 6
      WHERE "type" = 'REFERRER' AND "freeFioAccountProfileId" IS NULL;
      
    `);

    await queryInterface.sequelize.query(`
      UPDATE "referrer-profiles"
      SET "paidFioAccountProfileId" = 7
      WHERE "type" = 'REFERRER' AND "paidFioAccountProfileId" IS NULL;
    `);
  },
};
