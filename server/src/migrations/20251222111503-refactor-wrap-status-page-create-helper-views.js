'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async QI => {
    // View for all wrap operations across chains
    await QI.sequelize.query(`
      CREATE OR REPLACE VIEW v_all_wrap_operations AS
      SELECT 
        'EVM' as chain_type,
        n.name as network_name,
        e.network_id,
        e.event_type,
        e.block_number,
        e.block_timestamp as timestamp,
        e.transaction_hash as transaction_id,
        e.event_data as data,
        e.created_at
      FROM "wrap-status-evm-chain-events" e
      JOIN "wrap-status-networks" n ON e.network_id = n.id
      WHERE e.event_type IN ('wrap', 'unwrap', 'burn')

      UNION ALL

      SELECT
        'FIO' as chain_type,
        'FIO' as network_name,
        (SELECT id FROM "wrap-status-networks" WHERE name = 'FIO') as network_id,
        f.action_type as event_type,
        f.block_number,
        EXTRACT(EPOCH FROM f.timestamp)::BIGINT as timestamp,
        f.transaction_id,
        f.action_data as data,
        f.created_at
      FROM "wrap-status-fio-chain-events" f
      WHERE f.action_type IN ('wraptokens', 'wrapdomains', 'unwraptokens', 'unwrapdomain', 'burndomain')
      ORDER BY timestamp DESC;
    `);

    // View for oracle confirmations
    await QI.sequelize.query(`
      CREATE OR REPLACE VIEW v_oracle_confirmations AS
      SELECT
        n.name as network_name,
        e.network_id,
        e.block_number,
        e.block_timestamp as timestamp,
        e.transaction_hash,
        e.event_data,
        e.created_at
      FROM "wrap-status-evm-chain-events" e
      JOIN "wrap-status-networks" n ON e.network_id = n.id
      WHERE e.event_type = 'oracle_confirmation'
      ORDER BY e.block_timestamp DESC;
    `);

    // View for FIO wrap operations with oracle IDs
    await QI.sequelize.query(`
      CREATE OR REPLACE VIEW v_fio_wraps_with_oracle AS
      SELECT
        f.id,
        f.action_type,
        f.block_number,
        f.transaction_id,
        f.timestamp,
        f.actor,
        f.action_data,
        f.oracle_id,
        CASE 
          WHEN f.oracle_id IS NOT NULL THEN true
          ELSE false
        END as has_oracle_match
      FROM "wrap-status-fio-chain-events" f
      WHERE f.action_type IN ('wraptokens', 'wrapdomains')
      ORDER BY f.timestamp DESC;
    `);
  },

  down: async QI => {
    await QI.sequelize.query('DROP VIEW IF EXISTS v_all_wrap_operations;');
    await QI.sequelize.query('DROP VIEW IF EXISTS v_oracle_confirmations;');
    await QI.sequelize.query('DROP VIEW IF EXISTS v_fio_wraps_with_oracle;');
  },
};
