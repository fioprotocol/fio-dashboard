'use strict';

const { WRAP_STATUS_NETWORKS_IDS } = require('../config/constants');

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('wrap-status-block-numbers', 'isBurn', {
      type: DT.BOOLEAN,
      defaultValue: false,
    });

    await QI.bulkInsert('wrap-status-block-numbers', [
      {
        networkId: WRAP_STATUS_NETWORKS_IDS.POLYGON,
        isWrap: false,
        isBurn: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async QI => {
    await QI.bulkDelete('wrap-status-block-numbers', {
      networkId: WRAP_STATUS_NETWORKS_IDS.POLYGON,
      isWrap: false,
      isBurn: true,
    });
    await QI.removeColumn('wrap-status-block-numbers', 'isBurn');
  },
};
