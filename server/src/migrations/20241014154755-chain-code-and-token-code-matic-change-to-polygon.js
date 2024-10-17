'use strict';

module.exports = {
  up: async QI => {
    await QI.removeConstraint('token-codes-list', 'token-codes-list_chainCodeId_fkey');

    await QI.sequelize.transaction(async t => {
      await QI.bulkUpdate(
        'token-codes-list',
        { chainCodeId: 'POL' },
        { chainCodeId: 'MATIC' },
        { transaction: t },
      );

      await QI.bulkUpdate(
        'token-codes-list',
        { tokenCodeId: 'POL' },
        { tokenCodeId: 'MATIC' },
        { transaction: t },
      );

      await QI.bulkUpdate(
        'chain-codes-list',
        { chainCodeId: 'POL' },
        { chainCodeId: 'MATIC' },
        { transaction: t },
      );
    });

    await QI.addConstraint('token-codes-list', {
      fields: ['chainCodeId'],
      type: 'foreign key',
      name: 'token-codes-list_chainCodeId_fkey',
      references: {
        table: 'chain-codes-list',
        field: 'chainCodeId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async QI => {
    await QI.removeConstraint('token-codes-list', 'token-codes-list_chainCodeId_fkey');

    await QI.sequelize.transaction(async t => {
      await QI.bulkUpdate(
        'token-codes-list',
        { chainCodeId: 'MATIC' },
        { chainCodeId: 'POL' },
        { transaction: t },
      );

      await QI.bulkUpdate(
        'token-codes-list',
        { tokenCodeId: 'MATIC' },
        { tokenCodeId: 'POL' },
        { transaction: t },
      );

      await QI.bulkUpdate(
        'chain-codes-list',
        { chainCodeId: 'MATIC' },
        { chainCodeId: 'POL' },
        { transaction: t },
      );
    });

    await QI.addConstraint('token-codes-list', {
      fields: ['chainCodeId'],
      type: 'foreign key',
      name: 'token-codes-list_chainCodeId_fkey',
      references: {
        table: 'chain-codes-list',
        field: 'chainCodeId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
