'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.addColumn('users', 'timeZone', {
      type: DT.STRING,
      defaultValue: 'America/New_York',
    });
  },

  down: async QI => {
    return QI.removeColumn('users', 'timeZone');
  },
};
