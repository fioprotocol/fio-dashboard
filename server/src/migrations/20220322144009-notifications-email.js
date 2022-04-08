'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('notifications', 'emailDate', {
      type: DT.DATE,
      allowNull: true,
    });

    return QI.sequelize.query(
      `update public.notifications set "emailDate" = current_timestamp`,
    );
  },

  down: async QI => {
    await QI.removeColumn('notifications', 'emailDate');
    await QI.removeColumn('notifications', 'contentType');
    return QI.removeColumn('notifications', 'contentType');
  },
};
