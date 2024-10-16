'use strict';

module.exports = {
  up: async (QI, DT) => {
    const transaction = await QI.sequelize.transaction();

    await QI.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    try {
      await QI.bulkDelete('cart', null, { transaction });
      await QI.removeIndex('cart', 'id', { transaction });
      await QI.removeConstraint('cart', 'cart_pkey', { transaction });
      await QI.removeColumn('cart', 'id', { transaction });
      await QI.addColumn(
        'cart',
        'id',
        {
          type: DT.UUID,
          defaultValue: QI.sequelize.literal('uuid_generate_v4()'),
        },
        { transaction },
      );
      await QI.addConstraint('cart', ['id'], {
        type: 'primary key',
        name: 'cart_pkey',
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (QI, DT) => {
    const transaction = await QI.sequelize.transaction();

    try {
      await QI.bulkDelete('cart', null, { transaction });
      await QI.removeIndex('cart', 'id', { transaction });
      await QI.removeConstraint('cart', 'cart_pkey', { transaction });
      await QI.removeColumn('cart', 'id', { transaction });
      await QI.addColumn(
        'cart',
        'id',
        {
          type: DT.BIGINT,
          autoIncrement: true,
        },
        { transaction },
      );
      await QI.addConstraint('cart', ['id'], {
        type: 'primary key',
        name: 'cart_pkey',
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
