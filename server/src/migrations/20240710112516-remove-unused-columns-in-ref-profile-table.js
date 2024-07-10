'use strict';

module.exports = {
  up: async QI => {
    await QI.removeColumn('referrer-profiles', 'apiWebhook');
    await QI.removeColumn('referrer-profiles', 'simpleRegIpWhitelist');
    await QI.removeColumn('referrer-profiles', 'simpleRegEnabled');
  },

  down: async (QI, DT) => {
    await QI.addColumn('referrer-profiles', 'simpleRegEnabled', {
      type: DT.BOOLEAN,
      defaultValue: false,
    });
    await QI.addColumn('referrer-profiles', 'simpleRegIpWhitelist', {
      type: DT.TEXT,
      allowNull: false,
      defaultValue: '',
    });
    await QI.addColumn('referrer-profiles', 'apiWebhook', {
      type: DT.STRING,
      allowNull: true,
    });
  },
};
