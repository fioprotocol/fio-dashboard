'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QI, DT) => {
    // Check if table already exists
    const [tables] = await QI.sequelize.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'wrap-status-fio-chain-events';
    `);

    if (tables.length === 0) {
      await QI.createTable('wrap-status-fio-chain-events', {
        id: {
          type: DT.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        actionType: {
          type: DT.STRING(50),
          allowNull: false,
          field: 'action_type',
          comment:
            'wrapTokens | wrapDomain | unwrapTokens | unwrapDomain | burndomain | oravote',
        },
        blockNumber: {
          type: DT.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'block_number',
        },
        transactionId: {
          type: DT.STRING(64),
          allowNull: true,
          field: 'transaction_id',
        },
        timestamp: {
          type: DT.DATE,
          allowNull: false,
        },
        actor: {
          type: DT.STRING(13),
          allowNull: true,
          comment: 'FIO account name (max 12 chars)',
        },
        actionData: {
          type: DT.JSONB,
          allowNull: false,
          field: 'action_data',
        },
        oracleId: {
          type: DT.BIGINT,
          allowNull: true,
          field: 'oracle_id',
          comment: 'References oracle table entry for wrap operations',
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
      WHERE table_name = 'wrap-status-fio-chain-events' AND constraint_name = 'unique_fio_action';
    `);

    if (constraints.length === 0) {
      await QI.addConstraint('wrap-status-fio-chain-events', {
        fields: ['transaction_id', 'action_type'],
        type: 'unique',
        name: 'unique_fio_action',
      });
    }

    // Add indexes if they don't exist
    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_fio_events_action_type ON "wrap-status-fio-chain-events" (action_type);
    `);

    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_fio_events_block_number ON "wrap-status-fio-chain-events" (block_number);
    `);

    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_fio_events_transaction ON "wrap-status-fio-chain-events" (transaction_id);
    `);

    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_fio_events_timestamp ON "wrap-status-fio-chain-events" (timestamp);
    `);

    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_fio_events_actor ON "wrap-status-fio-chain-events" (actor);
    `);

    // Partial index for oracle_id (only when not null)
    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_fio_events_oracle_id ON "wrap-status-fio-chain-events" (oracle_id) WHERE oracle_id IS NOT NULL;
    `);

    // GIN index for JSONB
    await QI.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_fio_events_data ON "wrap-status-fio-chain-events" USING GIN (action_data);
    `);

    // Create trigger function for updated_at (CREATE OR REPLACE handles idempotency)
    await QI.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_fio_events_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger if it doesn't exist
    await QI.sequelize.query(`
      DROP TRIGGER IF EXISTS update_fio_events_updated_at_trigger ON "wrap-status-fio-chain-events";
    `);

    await QI.sequelize.query(`
      CREATE TRIGGER update_fio_events_updated_at_trigger
      BEFORE UPDATE ON "wrap-status-fio-chain-events"
      FOR EACH ROW
      EXECUTE FUNCTION update_fio_events_updated_at();
    `);
  },

  down: async QI => {
    // Drop trigger
    await QI.sequelize.query(`
      DROP TRIGGER IF EXISTS update_fio_events_updated_at_trigger ON "wrap-status-fio-chain-events";
    `);

    // Drop trigger function
    await QI.sequelize.query(`
      DROP FUNCTION IF EXISTS update_fio_events_updated_at();
    `);

    // Drop table
    await QI.dropTable('wrap-status-fio-chain-events');
  },
};
