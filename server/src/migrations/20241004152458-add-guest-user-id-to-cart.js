'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('cart', 'guestId', {
      type: DT.UUID,
      allowNull: true,
    });
  },

  down: async QI => {
    await QI.removeColumn('cart', 'guestId');
  },
};
