'use strict';

module.exports = {
  up: async QI => {
    await QI.renameColumn('cart', 'metamaskUserPublicKey', 'publicKey');
    await QI.sequelize.query(`
      UPDATE "order-items"
      SET data = jsonb_set(
        data::jsonb,
        '{publicKey}',
        data::jsonb -> 'metamaskUserPublicKey'
      ) - 'metamaskUserPublicKey'
      WHERE data::jsonb ? 'metamaskUserPublicKey';
    `);
  },

  down: async QI => {
    await QI.renameColumn('cart', 'publicKey', 'metamaskUserPublicKey');
    await QI.sequelize.query(`
      UPDATE "order-items"
      SET data = jsonb_set(
        data::jsonb,
        '{metamaskUserPublicKey}',
        data::jsonb -> 'publicKey'
      ) - 'publicKey'
      WHERE data::jsonb ? 'publicKey';
    `);
  },
};
