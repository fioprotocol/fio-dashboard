'use strict';

module.exports = {
  up: (QI, DT) => {
    return QI.createTable('actions', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      hash: { type: DT.STRING, allowNull: false, unique: true },
      type: {
        type: DT.ENUM,
        values: ['resetPassword', 'confirmEmail'],
      },
      data: { type: DT.JSON },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });
  },

  down: QI => {
    return QI.dropTable('actions');
  },
};
