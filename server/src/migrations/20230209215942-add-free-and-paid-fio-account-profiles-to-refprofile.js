'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.removeColumn('referrer-profiles', 'fioAccountProfileId');

    await QI.addColumn('referrer-profiles', 'freeFioAccountProfileId', {
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

    await QI.addColumn('referrer-profiles', 'paidFioAccountProfileId', {
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

  down: async (QI, DT) => {
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

    await QI.removeColumn('referrer-profiles', 'freeFioAccountProfileId');
    await QI.removeColumn('referrer-profiles', 'paidFioAccountProfileId');
  },
};
