'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('wrap-status-fio-burned-domains-logs', {
      transactionId: { type: DT.STRING, primaryKey: true },
      domain: { type: DT.STRING, allowNull: false },
      blockNumber: { type: DT.STRING, allowNull: false },
      data: { type: DT.JSON },
    });
  },

  down: async QI => {
    await QI.dropTable('wrap-status-fio-burned-domains-logs');
  },
};
