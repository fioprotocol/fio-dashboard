'use strict';

module.exports = {
  up: async (QI, DT) => {
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
    await QI.addColumn('referrer-profiles', 'apiToken', {
      type: DT.STRING,
      allowNull: true,
    });
    await QI.addColumn('referrer-profiles', 'fioAccountProfileId', {
      type: DT.BIGINT,
      references: {
        model: 'fio-account-profiles',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'set null',
      allowNull: false,
      defaultValue: 1,
    });
  },

  down: async QI => {
    await QI.removeColumn('referrer-profiles', 'fioAccountProfileId');
    await QI.removeColumn('referrer-profiles', 'apiToken');
    await QI.removeColumn('referrer-profiles', 'apiWebhook');
    await QI.removeColumn('referrer-profiles', 'simpleRegIpWhitelist');
    await QI.removeColumn('referrer-profiles', 'simpleRegEnabled');
  },
};
