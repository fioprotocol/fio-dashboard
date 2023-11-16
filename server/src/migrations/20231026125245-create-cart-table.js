'use strict';

module.exports = {
  up: async (QI, DT) => {
    return await QI.createTable('cart', {
      id: {
        type: DT.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      items: {
        type: DT.JSON,
      },
      isOldCart: { type: DT.BOOLEAN, defaultValue: false },
      userId: {
        type: DT.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        allowNull: true,
      },
    });
  },

  down: QI => {
    return QI.dropTable('cart');
  },
};
