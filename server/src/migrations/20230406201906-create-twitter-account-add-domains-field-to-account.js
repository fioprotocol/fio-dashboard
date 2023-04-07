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

    await QI.bulkInsert('fio-account-profiles', [
      {
        actor: TWITTER_ACCOUNT[process.env.FIO_CHAIN_ID],
        permission: 'regaddress',
        name: 'twitter',
        domains: '{"twitter"}',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async QI => {
    await QI.bulkDelete('fio-account-profiles', {
      actor: TWITTER_ACCOUNT[process.env.FIO_CHAIN_ID],
    });
    await QI.removeColumn('fio-account-profiles', 'domains');
  },
};
