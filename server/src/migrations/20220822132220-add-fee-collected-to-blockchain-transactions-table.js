'use strict';

module.exports = {
  up: async (QI, DT) => {
    return await QI.addColumn('blockchain-transactions', 'feeCollected', {
      type: DT.BIGINT,
      allowNull: true,
    });
  },

  down: async QI => {
    return QI.removeColumn('blockchain-transactions', 'feeCollected');
  },
};
