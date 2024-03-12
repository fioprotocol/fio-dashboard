'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('cart', 'metamaskUserPublicKey', {
      type: DT.STRING,
      allowNull: true,
    });
  },

  down: async QI => {
    await QI.removeColumn('cart', 'metamaskUserPublicKey');
  },
};
