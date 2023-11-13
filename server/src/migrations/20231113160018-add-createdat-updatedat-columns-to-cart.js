'use strict';

module.exports = {
  up: async (QI, DT) => {
    const tableInfo = await QI.describeTable('cart');

    if (!tableInfo.createdAt) {
      await QI.addColumn('cart', 'createdAt', {
        type: DT.DATE,
      });
    }
    if (!tableInfo.updatedAt) {
      await QI.addColumn('cart', 'updatedAt', {
        type: DT.DATE,
      });
    }
    return;
  },

  down: async QI => {
    await QI.removeColumn('cart', 'createdAt');
    await QI.removeColumn('cart', 'updatedAt');
  },
};
