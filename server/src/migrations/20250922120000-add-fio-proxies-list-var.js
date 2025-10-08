'use strict';

const { VARS_KEYS, FIO_PROXY_LIST } = require('../config/constants.js');

const setDefaultProxies = async () => {
  const chainId = process.env.FIO_CHAIN_ID;
  const fallback = (FIO_PROXY_LIST && FIO_PROXY_LIST[chainId]) || [];

  return fallback.map(proxy => ({ proxy, status: 200, error: null }));
};

module.exports = {
  up: async QI => {
    const proxies = await setDefaultProxies();

    return QI.bulkInsert('vars', [
      {
        key: VARS_KEYS.FIO_PROXIES_LIST,
        value: JSON.stringify(proxies),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async QI => {
    return QI.bulkDelete('vars', {
      key: VARS_KEYS.FIO_PROXIES_LIST,
    });
  },
};
