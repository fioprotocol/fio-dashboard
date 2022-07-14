'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.sequelize.transaction(async t => {
      await QI.addColumn(
        'admin-users',
        'lastLogIn',
        {
          type: DT.DATE,
        },
        { transaction: t },
      );
    });
  },

  down: async QI => {
    return QI.removeColumn('admin-users', 'lastLogIn');
  },
};
