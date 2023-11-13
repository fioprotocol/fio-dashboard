'use strict';

module.exports = {
  up: async QI => {
    await QI.addIndex('wallets', ['publicKey', 'userId', 'failedSyncedWithEdge'], {
      unique: true,
      fields: ['publicKey', 'userId', 'failedSyncedWithEdge'],
    });

    await QI.removeIndex('wallets', ['failedSyncedWithEdge']);
  },

  down: async QI => {
    await QI.removeIndex('wallets', ['publicKey', 'userId', 'failedSyncedWithEdge']);
  },
};
