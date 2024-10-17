'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('orders', 'guestId', {
      type: DT.UUID,
      allowNull: true,
    });
  },

  down: async QI => {
    await QI.removeColumn('orders', 'guestId');
  },
};
