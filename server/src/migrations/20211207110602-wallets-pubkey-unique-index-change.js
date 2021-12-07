'use strict';

module.exports = {
  up: async QI => {
    return QI.addIndex('wallets', ['publicKey', 'userId'], {
      unique: true,
      fields: ['publicKey', 'userId'],
    });
  },

  down: async QI => {
    return QI.removeIndex('wallets', ['publicKey', 'userId']);
  },
};
