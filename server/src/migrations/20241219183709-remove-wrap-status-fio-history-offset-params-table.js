'use strict';

module.exports = {
  up: async QI => {
    await QI.dropTable('wrap-status-fio-history-offset-params');
  },

  down: async (QI, DT) => {
    await QI.createTable('wrap-status-fio-history-offset-params', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      accountName: { type: DT.STRING, allowNull: false },
      accountActionSequence: { type: DT.INTEGER, defaultValue: 0 },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
    });

    await QI.bulkInsert('wrap-status-fio-history-offset-params', [
      {
        accountName: 'fio.oracle',
        accountActionSequence: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        accountName: 'fio.address',
        accountActionSequence: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
};
