'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('action-limit', {
      userId: {
        type: DT.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        allowNull: true,
      },
      action: { type: DT.STRING, allowNull: false },
      count: { type: DT.INTEGER, allowNull: false },
      updatedAt: { type: DT.DATE, allowNull: false },
    });
  },

  down: async QI => {
    await QI.dropTable('action-limit');
  },
};
