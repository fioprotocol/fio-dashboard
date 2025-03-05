'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('user-devices', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      userId: {
        type: DT.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        allowNull: false,
      },
      hash: { type: DT.STRING, allowNull: false },
      info: { type: DT.JSON, allowNull: false },
      createdAt: { type: DT.DATE, allowNull: false },
      updatedAt: { type: DT.DATE, allowNull: false },
    });
  },

  down: async QI => {
    await QI.dropTable('user-devices');
  },
};
