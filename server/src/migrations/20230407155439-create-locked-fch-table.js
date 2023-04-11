'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('locked-fch', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      fch: { type: DT.STRING, allowNull: false, comment: 'Twitter fch' },
      userId: {
        type: DT.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: true,
        comment: 'If we locked fch been logged in',
      },
      token: {
        type: DT.STRING,
        allowNull: true,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    return;
  },

  down: async QI => {
    return QI.dropTable('locked-fch');
  },
};
