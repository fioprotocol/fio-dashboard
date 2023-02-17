'use strict';

module.exports = {
  up: async QI => {
    await QI.removeColumn('referrer-profiles', 'regRefApiToken');
  },

  down: async (QI, DT) => {
    await QI.addColumn('referrer-profiles', 'regRefApiToken', {
      type: DT.STRING,
      allowNull: false,
    });
  },
};
