'use strict';

const config = require('../config/constants');

const TWITTER_ACCOUNT = {
  [config.FIO_CHAIN_ID.MAINNET]: 'vfmc3qc1kbcj',
  [config.FIO_CHAIN_ID.TESTNET]: 'jeisrr5ixar2',
};

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('fio-account-profiles', 'domains', {
      type: DT.ARRAY(DT.STRING),
      allowNull: true,
    });

    const actor = TWITTER_ACCOUNT[process.env.FIO_CHAIN_ID];
    const createdAt = new Date();
    const updatedAt = new Date();

    await QI.sequelize.query(
      `
      INSERT INTO "fio-account-profiles" (actor, permission, name, domains, "createdAt", "updatedAt")
      VALUES (:actor, 'regaddress', 'twitter', '{"twitter"}', :createdAt, :updatedAt)
      ON CONFLICT (id) DO NOTHING
      `,
      {
        replacements: { actor, createdAt, updatedAt },
        type: QI.sequelize.QueryTypes.INSERT,
      },
    );
  },

  down: async QI => {
    await QI.bulkDelete('fio-account-profiles', {
      actor: TWITTER_ACCOUNT[process.env.FIO_CHAIN_ID],
    });
    await QI.removeColumn('fio-account-profiles', 'domains');
  },
};
