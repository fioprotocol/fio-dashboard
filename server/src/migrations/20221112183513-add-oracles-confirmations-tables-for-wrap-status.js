'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.sequelize.transaction(async t => {
      await QI.createTable(
        'wrap-status-eth-oracles-confirmations-logs',
        {
          transactionHash: { type: DT.STRING, primaryKey: true },
          obtId: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );
      await QI.createTable(
        'wrap-status-polygon-oracles-confirmations-logs',
        {
          transactionHash: { type: DT.STRING, primaryKey: true },
          obtId: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );
    });
  },

  down: async QI => {
    await QI.dropTable('wrap-status-eth-oracles-confirmations-logs');
    return QI.dropTable('wrap-status-polygon-oracles-confirmations-logs');
  },
};
