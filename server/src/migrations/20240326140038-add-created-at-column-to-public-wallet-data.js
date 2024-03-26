'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('public-wallet-data', 'createdAt', {
      type: DT.DATE,
    });

    await QI.addColumn('public-wallet-data', 'updatedAt', {
      type: DT.DATE,
    });

    await QI.addColumn('public-wallet-data', 'deletedAt', {
      type: DT.DATE,
    });

    return;
  },

  down: async QI => {
    await QI.removeColumn('public-wallet-data', 'createdAt');
    await QI.removeColumn('public-wallet-data', 'updatedAt');
    await QI.removeColumn('public-wallet-data', 'deletedAt');
  },
};
