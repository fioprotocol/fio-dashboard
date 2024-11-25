'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('cart', 'options', {
      type: DT.JSON,
      allowNull: true,
    });
  },

  down: async QI => {
    await QI.removeColumn('cart', 'options');
  },
};
