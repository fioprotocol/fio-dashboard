'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('users', 'emailNotificationParams', {
      type: DT.JSON,
      defaultValue: {
        fioDomainExpiration: true,
        fioRequest: true,
        fioBalanceChange: true,
        lowBundles: true,
      },
      allowNull: false,
    });
  },

  down: async QI => {
    await QI.removeColumn('users', 'emailNotificationParams');
  },
};
