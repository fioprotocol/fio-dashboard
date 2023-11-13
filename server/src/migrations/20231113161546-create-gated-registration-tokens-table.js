'use strict';

module.exports = {
  up: async (QI, DT) => {
    return await QI.createTable('gated-registration-tokens', {
      token: {
        type: DT.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });
  },

  down: QI => {
    return QI.dropTable('gated-registration-tokens');
  },
};
