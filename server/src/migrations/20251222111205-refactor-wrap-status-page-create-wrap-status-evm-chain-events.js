'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('wrap-status-evm-chain-events', {
      id: {
        type: DT.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      networkId: {
        type: DT.BIGINT,
        allowNull: false,
        field: 'network_id',
        references: {
          model: 'wrap-status-networks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      eventType: {
        type: DT.STRING(50),
        allowNull: false,
        field: 'event_type',
        comment: 'wrap | unwrap | burn | oracle_confirmation',
      },
      blockNumber: {
        type: DT.BIGINT,
        allowNull: false,
        field: 'block_number',
      },
      blockTimestamp: {
        type: DT.BIGINT,
        allowNull: false,
        field: 'block_timestamp',
      },
      transactionHash: {
        type: DT.STRING(66),
        allowNull: false,
        field: 'transaction_hash',
      },
      eventData: {
        type: DT.JSONB,
        allowNull: false,
        field: 'event_data',
      },
      createdAt: {
        type: DT.DATE,
        allowNull: false,
        defaultValue: DT.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DT.DATE,
        allowNull: false,
        defaultValue: DT.NOW,
        field: 'updated_at',
      },
    });

    // Add unique constraint
    await QI.addConstraint('wrap-status-evm-chain-events', {
      fields: ['network_id', 'transaction_hash', 'event_type', 'block_number'],
      type: 'unique',
      name: 'unique_evm_event',
    });

    // Add indexes
    await QI.addIndex('wrap-status-evm-chain-events', ['network_id', 'event_type'], {
      name: 'idx_evm_events_network_type',
    });

    await QI.addIndex('wrap-status-evm-chain-events', ['block_number'], {
      name: 'idx_evm_events_block_number',
    });

    await QI.addIndex('wrap-status-evm-chain-events', ['transaction_hash'], {
      name: 'idx_evm_events_transaction',
    });

    await QI.addIndex('wrap-status-evm-chain-events', ['block_timestamp'], {
      name: 'idx_evm_events_timestamp',
    });

    // GIN index for JSONB (PostgreSQL specific)
    await QI.sequelize.query(`
      CREATE INDEX idx_evm_events_data ON "wrap-status-evm-chain-events" USING GIN (event_data);
    `);

    // Create trigger function for updated_at
    await QI.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_evm_events_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger
    await QI.sequelize.query(`
      CREATE TRIGGER update_evm_events_updated_at_trigger
      BEFORE UPDATE ON "wrap-status-evm-chain-events"
      FOR EACH ROW
      EXECUTE FUNCTION update_evm_events_updated_at();
    `);
  },

  down: async QI => {
    // Drop trigger
    await QI.sequelize.query(`
      DROP TRIGGER IF EXISTS update_evm_events_updated_at_trigger ON "wrap-status-evm-chain-events";
    `);

    // Drop trigger function
    await QI.sequelize.query(`
      DROP FUNCTION IF EXISTS update_evm_events_updated_at();
    `);

    // Drop table (indexes and constraints will be dropped automatically)
    await QI.dropTable('wrap-status-evm-chain-events');
  },
};
