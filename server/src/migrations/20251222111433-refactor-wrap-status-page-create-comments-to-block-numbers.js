'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async QI => {
    // Check if columns exist before attempting to remove duplicates
    const [columns] = await QI.sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'wrap-status-block-numbers' 
      AND column_name IN ('isWrap', 'isBurn');
    `);

    if (columns.length > 0) {
      // Remove duplicate rows by networkId, keeping one row per networkId
      // Priority: 1) isWrap=false AND isBurn=false, 2) highest blockNumber, 3) lowest id
      await QI.sequelize.query(`
        WITH ranked_rows AS (
          SELECT id,
            ROW_NUMBER() OVER (
              PARTITION BY "networkId"
              ORDER BY
                CASE WHEN "isWrap" = false AND "isBurn" = false THEN 0 ELSE 1 END,
                CAST("blockNumber" AS BIGINT) DESC,
                id ASC
            ) as rn
          FROM "wrap-status-block-numbers"
        )
        DELETE FROM "wrap-status-block-numbers"
        WHERE id IN (
          SELECT id FROM ranked_rows WHERE rn > 1
        );
      `);

      // Remove deprecated columns if they exist
      const columnNames = columns.map(col => col.column_name);

      if (columnNames.includes('isWrap')) {
        await QI.removeColumn('wrap-status-block-numbers', 'isWrap');
      }

      if (columnNames.includes('isBurn')) {
        await QI.removeColumn('wrap-status-block-numbers', 'isBurn');
      }
    }
  },

  down: async (QI, DT) => {
    // Recreate columns for rollback
    await QI.addColumn('wrap-status-block-numbers', 'isWrap', {
      type: DT.BOOLEAN,
      defaultValue: false,
    });

    await QI.addColumn('wrap-status-block-numbers', 'isBurn', {
      type: DT.BOOLEAN,
      defaultValue: false,
    });

    // Set isWrap: true for networkId 1 (ETH) and 2 (POLYGON)
    await QI.sequelize.query(`
      UPDATE "wrap-status-block-numbers"
      SET "isWrap" = true
      WHERE "networkId" IN (1, 2);
    `);

    // For networkId 2 (POLYGON), add a record with isBurn: true
    // Check if record already exists to avoid duplicates
    const [results] = await QI.sequelize.query(`
      SELECT id FROM "wrap-status-block-numbers"
      WHERE "networkId" = 2 AND "isBurn" = true
      LIMIT 1;
    `);

    if (results.length === 0) {
      await QI.bulkInsert('wrap-status-block-numbers', [
        {
          networkId: 2,
          isWrap: false,
          isBurn: true,
          blockNumber: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },
};
