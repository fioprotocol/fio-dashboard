'use strict';

module.exports = {
  up: async QI => {
    await QI.removeColumn('cart', 'isOldCart');
  },

  down: async (QI, DT) => {
    await QI.addColumn('cart', 'isOldCart', {
      type: DT.BOOLEAN,
      defaultValue: false,
    });
  },
};
