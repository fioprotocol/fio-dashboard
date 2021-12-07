'use strict';

module.exports = {
  up: (QI, DT) => {
    return QI.createTable('new-device-two-factor', {
      id: {
        type: DT.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
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
      voucherId: { type: DT.STRING, unique: true },
      deviceDescription: { type: DT.STRING },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });
  },

  down: QI => {
    return QI.dropTable('new-device-two-factor');
  },
};
