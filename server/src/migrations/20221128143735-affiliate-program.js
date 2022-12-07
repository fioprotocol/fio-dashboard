'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('users', 'affiliateProfileId', {
      type: DT.BIGINT,
    });
    return QI.addColumn('referrer-profiles', 'type', {
      type: DT.STRING,
      defaultValue: 'REFERRER',
    });
  },

  down: async QI => {
    await QI.removeColumn('users', 'affiliateProfileId');
    return QI.removeColumn('referrer-profiles', 'type');
  },
};
