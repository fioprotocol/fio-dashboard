'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('usernames', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      username: {
        type: DT.STRING,
        allowNull: true,
        comment: 'Username on custom domain',
      },
      rank: {
        type: DT.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Rank of the username (for sorting purposes)',
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    return;
  },

  down: async (QI) => {
    return QI.dropTable('usernames');
  },
};
