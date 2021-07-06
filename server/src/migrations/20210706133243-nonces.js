'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.createTable('nonces', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      value: { type: DT.STRING },
      email: { type: DT.STRING },
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
    });
  },

  down: async QI => {
    return QI.dropTable('nonces');
  },
};
