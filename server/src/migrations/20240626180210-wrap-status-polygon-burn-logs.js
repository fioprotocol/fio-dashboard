'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('wrap-status-polygon-burned-domains-logs', {
      transactionHash: { type: DT.STRING, primaryKey: true },
      obtId: { type: DT.STRING, allowNull: false },
      data: { type: DT.JSON },
    });
  },

  down: async QI => {
    await QI.dropTable('wrap-status-polygon-burned-domains-logs');
  },
};
