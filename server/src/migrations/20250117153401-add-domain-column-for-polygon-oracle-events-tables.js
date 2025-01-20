'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('wrap-status-polygon-oracles-confirmations-logs', 'domain', {
      type: DT.STRING,
      allowNull: true,
    });
    await QI.addColumn('wrap-status-polygon-oracles-confirmations-logs', 'tokenId', {
      type: DT.STRING,
      allowNull: true,
    });
    await QI.addColumn('wrap-status-polygon-burned-domains-logs', 'domain', {
      type: DT.STRING,
      allowNull: true,
    });
  },

  down: async QI => {
    await QI.removeColumn('wrap-status-polygon-oracles-confirmations-logs', 'domain');
    await QI.removeColumn('wrap-status-polygon-oracles-confirmations-logs', 'tokenId');
    await QI.removeColumn('wrap-status-polygon-burned-domains-logs', 'domain');
  },
};
