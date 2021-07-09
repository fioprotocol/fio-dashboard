'use strict';

module.exports = {
  up: async QI => {
    await QI.removeColumn('users', 'password');
    return QI.removeColumn('users', 'pin');
  },

  down: async (QI, DT) => {
    await QI.addColumn('users', 'password', {
      type: DT.STRING,
    });
    return QI.addColumn('users', 'pin', {
      type: DT.STRING,
    });
  },
};
