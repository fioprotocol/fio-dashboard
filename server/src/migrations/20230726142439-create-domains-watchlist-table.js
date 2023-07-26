'use strict';

module.exports = {
  up: async (QI, DT) => {
    return await QI.createTable('domains-watchlist', {
      id: {
        type: DT.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      domain: {
        type: DT.STRING,
        allowNull: false,
      },
      userId: {
        type: DT.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: false,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });
  },

  down: QI => {
    return QI.dropTable('domains-watchlist');
  },
};
