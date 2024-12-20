'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('wrap-status-fio-wrap-tokens-logs', 'oracleId', {
      type: DT.STRING,
    });
    return QI.addColumn('wrap-status-fio-wrap-nft-logs', 'oracleId', {
      type: DT.STRING,
    });
  },

  down: async QI => {
    await QI.removeColumn('wrap-status-fio-wrap-tokens-logs', 'oracleId');
    return QI.removeColumn('wrap-status-fio-wrap-nft-logs', 'oracleId');
  },
};
