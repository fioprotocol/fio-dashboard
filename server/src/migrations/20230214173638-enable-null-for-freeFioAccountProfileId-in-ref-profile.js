'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.changeColumn('referrer-profiles', 'freeFioAccountProfileId', {
      type: DT.BIGINT,
      allowNull: true,
    });
    await QI.changeColumn('referrer-profiles', 'paidFioAccountProfileId', {
      type: DT.BIGINT,
      allowNull: true,
    });
  },

  down: async (QI, DT) => {
    await QI.changeColumn('referrer-profiles', 'freeFioAccountProfileId', {
      type: DT.BIGINT,
      allowNull: false,
    });
    await QI.changeColumn('referrer-profiles', 'paidFioAccountProfileId', {
      type: DT.BIGINT,
      allowNull: false,
    });
  },
};
