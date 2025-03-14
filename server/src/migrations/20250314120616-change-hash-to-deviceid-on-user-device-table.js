'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the table exists
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('user-devices')) {
      return;
    }

    // Get table info to check existing columns
    const tableInfo = await queryInterface.describeTable('user-devices');

    // Add deviceId column if it doesn't exist yet
    if (!tableInfo.deviceId) {
      await queryInterface.addColumn('user-devices', 'deviceId', {
        type: Sequelize.STRING(64),
        allowNull: true,
      });
    }

    // Create index on deviceId if needed
    try {
      await queryInterface.addIndex('user-devices', ['deviceId'], {
        name: 'user_devices_deviceid',
        using: 'BTREE',
      });
    } catch (indexError) {
      // eslint-disable-next-line no-console
      console.error('Index may already exist', indexError);
    }

    // Only attempt to drop the hash column if it exists
    if (tableInfo.hash) {
      // First, check and remove any indexes that might reference the hash column
      const indexes = await queryInterface.showIndex('user-devices');
      for (const index of indexes) {
        // Skip primary key and other system indexes
        if (
          index.name !== 'PRIMARY' &&
          !index.name.endsWith('_pkey') &&
          index.name.includes('hash')
        ) {
          await queryInterface.removeIndex('user-devices', index.name);
        }
      }

      // Now drop the column
      await queryInterface.removeColumn('user-devices', 'hash');
    }
  },

  async down(queryInterface, Sequelize) {
    // Check if the table exists
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('user-devices')) {
      return;
    }

    // Get table info to check existing columns
    const tableInfo = await queryInterface.describeTable('user-devices');

    // Add hash column if it doesn't exist yet
    if (!tableInfo.hash) {
      await queryInterface.addColumn('user-devices', 'hash', {
        type: Sequelize.STRING(64),
        allowNull: true,
      });
    }

    // Create indexes on hash if needed
    try {
      await queryInterface.addIndex('user-devices', ['hash'], {
        name: 'user_devices_hash',
        using: 'BTREE',
      });

      await queryInterface.addIndex('user-devices', ['userId', 'hash'], {
        name: 'user_devices_user_hash_unique',
        unique: true,
      });
    } catch (indexError) {
      // eslint-disable-next-line no-console
      console.error('Index may already exist', indexError);
    }

    // Only attempt to drop the deviceId column if it exists
    if (tableInfo.deviceId) {
      // First, check and remove any indexes that might reference the deviceId column
      const indexes = await queryInterface.showIndex('user-devices');
      for (const index of indexes) {
        // Skip primary key and other system indexes
        if (
          index.name !== 'PRIMARY' &&
          !index.name.endsWith('_pkey') &&
          index.name.includes('device')
        ) {
          await queryInterface.removeIndex('user-devices', index.name);
        }
      }

      // Now drop the column
      await queryInterface.removeColumn('user-devices', 'deviceId');
    }
  },
};
