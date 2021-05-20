'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.createTable('free-addresses', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: DT.STRING, allowNull: false },
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
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });
  },

  down: async QI => {
    return QI.dropTable('free-addresses');
  },
};
