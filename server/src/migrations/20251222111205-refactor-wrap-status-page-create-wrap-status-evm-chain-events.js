'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QI, DT) => {
    // Check if table already exists
    const [tables] = await QI.sequelize.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'wrap-status-evm-chain-events';
    `);

    if (!tables || tables.length === 0) {
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
    }

    // Add unique constraint if it doesn't exist
    const [constraints] = await QI.sequelize.query(`
      SELECT constraint_name FROM information_schema.table_constraints 
      WHERE table_name = 'wrap-status-evm-chain-events' AND constraint_name = 'unique_evm_event';
    `);

    if (!constraints || constraints.length === 0) {
      await QI.addConstraint('wrap-status-evm-chain-events', {
        fields: ['network_id', 'transaction_hash', 'event_type', 'block_number'],
        type: 'unique',
        name: 'unique_evm_event',
      });
    }

    // Add indexes if they don't exist
    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_evm_events_network_type ON "wrap-status-evm-chain-events" (network_id, event_type);
    `);

    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_evm_events_block_number ON "wrap-status-evm-chain-events" (block_number);
    `);

    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_evm_events_transaction ON "wrap-status-evm-chain-events" (transaction_hash);
    `);

    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_evm_events_timestamp ON "wrap-status-evm-chain-events" (block_timestamp);
    `);

    // GIN index for JSONB (PostgreSQL specific)
    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_evm_events_data ON "wrap-status-evm-chain-events" USING GIN (event_data);
    `);

    // Create trigger function for updated_at (CREATE OR REPLACE handles idempotency)
    await QI.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_evm_events_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger if it doesn't exist
    await QI.sequelize.query(`
      DROP TRIGGER IF EXISTS update_evm_events_updated_at_trigger ON "wrap-status-evm-chain-events";
    `);

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

    // Drop table if exists (indexes and constraints will be dropped automatically)
    await QI.sequelize.query(`
      DROP TABLE IF EXISTS "wrap-status-evm-chain-events";
    `);
  },
};
