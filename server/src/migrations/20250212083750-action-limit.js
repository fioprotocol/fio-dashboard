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

    await QI.addIndex('action-limit', ['userId', 'action'], {
      unique: true,
      name: 'action_limit_user_action_unique',
    });
  },

  down: async QI => {
    await QI.dropTable('action-limit');
  },
};
