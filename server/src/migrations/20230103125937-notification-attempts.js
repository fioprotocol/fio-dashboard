'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.addColumn('notifications', 'attempts', {
      type: DT.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async QI => {
    return QI.removeColumn('notifications', 'attempts');
  },
};
