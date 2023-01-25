'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('wrap-status-fio-unwrap-nfts-oravotes', 'attempts', {
      type: DT.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    return QI.addColumn('wrap-status-fio-unwrap-tokens-oravotes', 'attempts', {
      type: DT.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async QI => {
    await QI.removeColumn('wrap-status-fio-unwrap-nfts-oravotes', 'attempts');
    return QI.removeColumn('wrap-status-fio-unwrap-tokens-oravotes', 'attempts');
  },
};
