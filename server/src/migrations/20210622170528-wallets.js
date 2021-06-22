'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.createTable('wallets', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      publicKey: { type: DT.STRING, allowNull: false },
      edgeId: { type: DT.STRING, allowNull: false, unique: true },
      name: { type: DT.STRING, allowNull: true },
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
      data: { type: DT.JSON },
    });
  },

  down: async QI => {
    return QI.dropTable('wallets');
  },
};
