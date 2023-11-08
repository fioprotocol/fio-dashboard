'use strict';

const config = require('../config/constants');

const DEFAULT_CHAIN_ID = {
  [config.FIO_CHAIN_ID.MAINNET]: '1', // Ethereum mainnet
  [config.FIO_CHAIN_ID.TESTNET]: '5', // Ethereum testnet goerli
};

const chainId = DEFAULT_CHAIN_ID[process.env.FIO_CHAIN_ID];

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = jsonb_set(
          settings::jsonb,
          '{domains}',
          (
              SELECT jsonb_agg(jsonb_set(domain::jsonb, '{isFirstRegFree}', 'false'::jsonb)::json)
              FROM json_array_elements(settings->'domains') AS domain
          ),
          true
      )::json
      WHERE settings->'domains' IS NOT NULL;
    `);

    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = jsonb_set(
          settings::jsonb,
          '{gatedRegistration}',
          '{"isOn": false, "params": {"asset": "NFT", "chainId": "${chainId}", "contractAddress": ""}}',
          true
      );
  `);
    return;
  },

  down: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = jsonb_set(
          settings::jsonb,
          '{domains}',
          (
              SELECT jsonb_agg(domain::jsonb #- '{isFirstRegFree}')
              FROM json_array_elements(settings->'domains') AS domain
          ),
          true
      )::json
      WHERE settings->'domains' IS NOT NULL;
    `);

    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = settings::jsonb #- '{gatedRegistration}'
    `);
    return;
  },
};
