'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('search-terms', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      term: { type: DT.STRING, allowNull: true, comment: 'Search term' },
      rank: {
        type: DT.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Rank of the search term (for sorting purposes)',
      },
      isPrefix: {
        type: DT.BOOLEAN,
        defaultValue: false,
        comment: 'If the term is prefix or postfix',
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    return;
  },

  down: async QI => {
    return QI.dropTable('search-terms');
  },
};
