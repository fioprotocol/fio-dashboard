'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('payments', 'spentType', {
      type: DT.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment:
        'Payment spent type: ORDER(1), ACTION(2), ACTION_REFUND(3), ORDER_REFUND(4)',
    });

    await QI.addIndex('payments', ['spentType'], {
      fields: ['spentType'],
    });
  },

  down: async QI => {
    return QI.removeColumn('payments', 'spentType');
  },
};
