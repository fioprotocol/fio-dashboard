'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('wallets', 'createdAt', {
      type: DT.DATE,
    });
    await QI.addColumn('wallets', 'updatedAt', {
      type: DT.DATE,
    });
    return QI.addColumn('wallets', 'deletedAt', {
      type: DT.DATE,
    });
  },

  down: async QI => {
    await QI.removeColumn('wallets', 'createdAt');
    await QI.removeColumn('wallets', 'updatedAt');
    return QI.removeColumn('wallets', 'deletedAt');
  },
};
