'use strict';

module.exports = {
  up: async QI => {
    const [results] = await QI.sequelize.query(
      `SELECT * FROM "token-codes-list" WHERE "chainCodeId" = 'POL' AND "tokenCodeId" = 'POL' AND "tokenCodeName" = 'Polygon' LIMIT 1`,
    );

    if (results.length === 0) {
      await QI.bulkInsert(
        'token-codes-list',
        [
          {
            chainCodeId: 'POL',
            tokenCodeId: 'POL',
            tokenCodeName: 'Polygon',
          },
        ],
        {},
      );
    }
  },

  down: async QI => {
    await QI.bulkDelete(
      'token-codes-list',
      { chainCodeId: 'POL', tokenCodeId: 'POL', tokenCodeName: 'Polygon' },
      {},
    );
  },
};
