'use strict';

const path = require('path');
const { WALLET_CREATED_FROM } = require(path.resolve(
  __dirname,
  '../config/constants.js',
));

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('wallets', 'from', {
      type: DT.STRING,
      allowNull: false,
      defaultValue: WALLET_CREATED_FROM.EDGE,
    });
    await QI.removeIndex('wallets', 'edgeId');
    try {
      await QI.removeConstraint('wallets', 'edgeId_unique_idx');
    } catch (e) {
      // if not exist
    }
    return QI.changeColumn('wallets', 'edgeId', {
      type: DT.STRING,
      unique: true,
    });
  },

  down: async QI => {
    await QI.removeColumn('wallets', 'from');
    // todo: possible null values, can't return back to allowNull = false
    return QI.removeIndex('wallets', ['edgeId']);
  },
};
