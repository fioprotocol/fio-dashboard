'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.createTable('notifications', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      type: { type: DT.STRING, allowNull: false },
      action: { type: DT.STRING, allowNull: true },
      title: { type: DT.STRING, allowNull: true },
      message: { type: DT.TEXT },
      userId: {
        type: DT.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: true,
      },
      seenDate: { type: DT.DATE, allowNull: true },
      closeDate: { type: DT.DATE, allowNull: true },
      data: { type: DT.JSON },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });
  },

  down: async QI => {
    return QI.dropTable('notifications');
  },
};
