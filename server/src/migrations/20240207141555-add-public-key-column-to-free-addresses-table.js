'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('free-addresses', 'publicKey', {
      type: DT.STRING,
    });
  },

  down: async QI => {
    await QI.removeColumn('free-addresses', 'publicKey');
  },
};
