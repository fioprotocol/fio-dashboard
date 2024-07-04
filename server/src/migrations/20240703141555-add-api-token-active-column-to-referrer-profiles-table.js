'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('referrer-profiles', 'apiAccess', {
      type: DT.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async QI => {
    await QI.removeColumn('referrer-profiles', 'apiAccess');
  },
};
