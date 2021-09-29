'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.removeColumn('actions', 'type');
    return QI.addColumn('actions', 'type', {
      type: DT.STRING,
    });
  },

  down: async (QI, DT) => {
    await QI.removeColumn('actions', 'type');
    return QI.addColumn('actions', 'type', {
      type: DT.ENUM,
      values: ['resetPassword', 'confirmEmail'],
    });
  },
};
