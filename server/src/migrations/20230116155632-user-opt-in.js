'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.addColumn('users', 'isOptIn', {
      type: DT.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async QI => {
    return QI.removeColumn('users', 'isOptIn');
  },
};
