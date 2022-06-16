'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('orders', 'number', {
      type: DT.STRING,
      allowNull: true,
      unique: true,
      defaultValue: null,
      comment: 'Order number',
    });

    await QI.addIndex('orders', ['number'], {
      fields: ['number'],
    });
  },

  down: async QI => {
    return QI.removeColumn('orders', 'number');
  },
};
