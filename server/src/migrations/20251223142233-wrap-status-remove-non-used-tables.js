'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async t => {
      // Drop tables in reverse dependency order (child tables first)
      // Using IF EXISTS to make migration idempotent
      const tablesToDrop = [
        'wrap-status-fio-unwrap-nfts-logs',
        'wrap-status-fio-unwrap-tokens-logs',
        'wrap-status-fio-unwrap-nfts-oravotes',
        'wrap-status-fio-unwrap-tokens-oravotes',
        'wrap-status-fio-wrap-nft-logs',
        'wrap-status-fio-wrap-tokens-logs',
        'wrap-status-fio-burned-domains-logs',
        'wrap-status-polygon-burned-domains-logs',
        'wrap-status-polygon-oracles-confirmations-logs',
        'wrap-status-polygon-unwrap-logs',
        'wrap-status-polygon-wrap-logs',
        'wrap-status-eth-oracles-confirmations-logs',
        'wrap-status-eth-unwrap-logs',
        'wrap-status-eth-wrap-logs',
      ];

      for (const tableName of tablesToDrop) {
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS "${tableName}";`, {
          transaction: t,
        });
      }
    });
  },

  async down(queryInterface, Sequelize) {
    const { DataTypes: DT } = Sequelize;

    // Helper function to check if table exists
    const tableExists = async (tableName, transaction) => {
      const [tables] = await queryInterface.sequelize.query(
        `SELECT table_name FROM information_schema.tables 
         WHERE table_schema = 'public' AND table_name = '${tableName}';`,
        { transaction },
      );
      return tables && tables.length > 0;
    };

    return queryInterface.sequelize.transaction(async t => {
      // Recreate tables in dependency order (parent tables first)
      // Only create if table doesn't exist

      // ETH tables
      if (!(await tableExists('wrap-status-eth-wrap-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-eth-wrap-logs',
          {
            transactionHash: { type: DT.STRING, primaryKey: true },
            obtId: { type: DT.STRING, allowNull: false },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-eth-unwrap-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-eth-unwrap-logs',
          {
            transactionHash: { type: DT.STRING, primaryKey: true },
            address: { type: DT.STRING, allowNull: false },
            blockNumber: { type: DT.STRING, allowNull: false },
            amount: { type: DT.STRING, allowNull: false },
            fioAddress: { type: DT.STRING, allowNull: false },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-eth-oracles-confirmations-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-eth-oracles-confirmations-logs',
          {
            transactionHash: { type: DT.STRING, primaryKey: true },
            obtId: { type: DT.STRING, allowNull: false },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      // Polygon tables
      if (!(await tableExists('wrap-status-polygon-wrap-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-polygon-wrap-logs',
          {
            transactionHash: { type: DT.STRING, primaryKey: true },
            obtId: { type: DT.STRING, allowNull: false },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-polygon-unwrap-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-polygon-unwrap-logs',
          {
            transactionHash: { type: DT.STRING, primaryKey: true },
            address: { type: DT.STRING, allowNull: false },
            blockNumber: { type: DT.STRING, allowNull: false },
            domain: { type: DT.STRING, allowNull: false },
            fioAddress: { type: DT.STRING, allowNull: false },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-polygon-oracles-confirmations-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-polygon-oracles-confirmations-logs',
          {
            transactionHash: { type: DT.STRING, primaryKey: true },
            obtId: { type: DT.STRING, allowNull: false },
            domain: { type: DT.STRING, allowNull: true },
            tokenId: { type: DT.STRING, allowNull: true },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-polygon-burned-domains-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-polygon-burned-domains-logs',
          {
            transactionHash: { type: DT.STRING, primaryKey: true },
            obtId: { type: DT.STRING, allowNull: false },
            domain: { type: DT.STRING, allowNull: true },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      // FIO tables
      if (!(await tableExists('wrap-status-fio-wrap-tokens-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-fio-wrap-tokens-logs',
          {
            transactionId: { type: DT.STRING, primaryKey: true },
            address: { type: DT.STRING, allowNull: false },
            amount: { type: DT.STRING, allowNull: false },
            blockNumber: { type: DT.STRING, allowNull: false },
            oracleId: { type: DT.STRING },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-fio-wrap-nft-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-fio-wrap-nft-logs',
          {
            transactionId: { type: DT.STRING, primaryKey: true },
            address: { type: DT.STRING, allowNull: false },
            domain: { type: DT.STRING, allowNull: false },
            blockNumber: { type: DT.STRING, allowNull: false },
            oracleId: { type: DT.STRING },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-fio-burned-domains-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-fio-burned-domains-logs',
          {
            transactionId: { type: DT.STRING, primaryKey: true },
            domain: { type: DT.STRING, allowNull: false },
            blockNumber: { type: DT.STRING, allowNull: false },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-fio-unwrap-tokens-oravotes', t))) {
        await queryInterface.createTable(
          'wrap-status-fio-unwrap-tokens-oravotes',
          {
            id: { type: DT.BIGINT, primaryKey: true },
            obtId: { type: DT.STRING, allowNull: false },
            isComplete: { type: DT.BOOLEAN, defaultValue: false },
            data: { type: DT.JSON },
            attempts: {
              type: DT.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-fio-unwrap-nfts-oravotes', t))) {
        await queryInterface.createTable(
          'wrap-status-fio-unwrap-nfts-oravotes',
          {
            id: { type: DT.BIGINT, primaryKey: true },
            obtId: { type: DT.STRING, allowNull: false },
            isComplete: { type: DT.BOOLEAN, defaultValue: false },
            data: { type: DT.JSON },
            attempts: {
              type: DT.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-fio-unwrap-tokens-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-fio-unwrap-tokens-logs',
          {
            transactionId: { type: DT.STRING, primaryKey: true },
            obtId: { type: DT.STRING, allowNull: false },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }

      if (!(await tableExists('wrap-status-fio-unwrap-nfts-logs', t))) {
        await queryInterface.createTable(
          'wrap-status-fio-unwrap-nfts-logs',
          {
            transactionId: { type: DT.STRING, primaryKey: true },
            obtId: { type: DT.STRING, allowNull: false },
            data: { type: DT.JSON },
          },
          { transaction: t },
        );
      }
    });
  },
};
