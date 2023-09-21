'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('wallets', 'failedSyncedWithEdge', {
      type: DT.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async QI => {
    await QI.removeColumn('wallets', 'failedSyncedWithEdge');
  },
};
