'use strict';

const { WRAP_STATUS_NETWORKS_IDS, WRAP_STATUS_NETWORKS } = require('../config/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Check if BASE network already exists
    const [networks] = await queryInterface.sequelize.query(`
      SELECT id FROM "wrap-status-networks" WHERE id = ${WRAP_STATUS_NETWORKS_IDS.BASE};
    `);

    if (networks.length === 0) {
      // Add BASE network (id: 4)
      await queryInterface.bulkInsert('wrap-status-networks', [
        {
          id: WRAP_STATUS_NETWORKS_IDS.BASE,
          name: WRAP_STATUS_NETWORKS.BASE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // Check if block number record for BASE network already exists
    const [blockNumbers] = await queryInterface.sequelize.query(`
      SELECT "networkId" FROM "wrap-status-block-numbers" WHERE "networkId" = ${WRAP_STATUS_NETWORKS_IDS.BASE};
    `);

    if (blockNumbers.length === 0) {
      // Add block number record for BASE network (networkId: 4)
      await queryInterface.bulkInsert('wrap-status-block-numbers', [
        {
          networkId: WRAP_STATUS_NETWORKS_IDS.BASE,
          blockNumber: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface) {
    // Remove block number record for BASE network
    await queryInterface.bulkDelete('wrap-status-block-numbers', {
      networkId: WRAP_STATUS_NETWORKS_IDS.BASE,
    });

    // Remove BASE network
    await queryInterface.bulkDelete('wrap-status-networks', {
      id: WRAP_STATUS_NETWORKS_IDS.BASE,
    });
  },
};
