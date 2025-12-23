'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async t => {
      // Drop tables in reverse dependency order (child tables first)
      await queryInterface.dropTable('wrap-status-fio-unwrap-nfts-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-fio-unwrap-tokens-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-fio-unwrap-nfts-oravotes', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-fio-unwrap-tokens-oravotes', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-fio-wrap-nft-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-fio-wrap-tokens-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-fio-burned-domains-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-polygon-burned-domains-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-polygon-oracles-confirmations-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-polygon-unwrap-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-polygon-wrap-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-eth-oracles-confirmations-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-eth-unwrap-logs', {
        transaction: t,
      });
      await queryInterface.dropTable('wrap-status-eth-wrap-logs', {
        transaction: t,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    const { DataTypes: DT } = Sequelize;

    return queryInterface.sequelize.transaction(async t => {
      // Recreate tables in dependency order (parent tables first)

      // ETH tables
      await queryInterface.createTable(
        'wrap-status-eth-wrap-logs',
        {
          transactionHash: { type: DT.STRING, primaryKey: true },
          obtId: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );

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

      await queryInterface.createTable(
        'wrap-status-eth-oracles-confirmations-logs',
        {
          transactionHash: { type: DT.STRING, primaryKey: true },
          obtId: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );

      // Polygon tables
      await queryInterface.createTable(
        'wrap-status-polygon-wrap-logs',
        {
          transactionHash: { type: DT.STRING, primaryKey: true },
          obtId: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );

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

      // FIO tables
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

      await queryInterface.createTable(
        'wrap-status-fio-unwrap-tokens-logs',
        {
          transactionId: { type: DT.STRING, primaryKey: true },
          obtId: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );

      await queryInterface.createTable(
        'wrap-status-fio-unwrap-nfts-logs',
        {
          transactionId: { type: DT.STRING, primaryKey: true },
          obtId: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );
    });
  },
};
