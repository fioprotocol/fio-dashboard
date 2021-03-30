'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('users', 'secretSet', {
      type: DT.BOOLEAN,
      defaultValue: false,
    });
    return QI.addColumn('users', 'pin', {
      type: DT.STRING,
    });
  },

  down: async QI => {
    await QI.removeColumn('users', 'secretSet');
    return QI.removeColumn('users', 'pin');
  },
};
