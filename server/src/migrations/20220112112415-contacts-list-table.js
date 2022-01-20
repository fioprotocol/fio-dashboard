'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.createTable('contacts-list', {
      id: {
        type: DT.UUID,
        defaultValue: DT.UUIDV4,
        primaryKey: true,
      },
      name: { type: DT.STRING },
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
    });
  },

  down: QI => {
    return QI.dropTable('contacts-list');
  },
};
