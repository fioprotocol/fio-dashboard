'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('domains', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: DT.STRING, allowNull: true, comment: 'Domain name' },
      rank: {
        type: DT.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Rank of the domain name (for sorting purposes)',
      },
      isPremium: {
        type: DT.BOOLEAN,
        defaultValue: false,
        comment: 'If the domain is premium or not',
      },
      isDashboardDomain: {
        type: DT.BOOLEAN,
        comment: 'Is for dashboard',
        defaultValue: false,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    return;
  },

  down: async QI => {
    return QI.dropTable('domains');
  },
};
