'use strict';

const { WRAP_STATUS_NETWORKS_IDS, WRAP_STATUS_NETWORKS } = require('../config/constants');

module.exports = {
  up: async (QI, DT) => {
    return QI.sequelize.transaction(async t => {
      await QI.createTable(
        'wrap-status-networks',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          name: { type: DT.STRING },
          createdAt: { type: DT.DATE },
          updatedAt: { type: DT.DATE },
        },
        { transaction: t },
      );

      await QI.bulkInsert(
        'wrap-status-networks',
        [
          {
            name: WRAP_STATUS_NETWORKS.ETH,
            id: WRAP_STATUS_NETWORKS_IDS.ETH,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: WRAP_STATUS_NETWORKS.POLYGON,
            id: WRAP_STATUS_NETWORKS_IDS.POLYGON,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: WRAP_STATUS_NETWORKS.FIO,
            id: WRAP_STATUS_NETWORKS_IDS.FIO,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction: t },
      );

      await QI.createTable(
        'wrap-status-block-numbers',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          blockNumber: { type: DT.STRING, defaultValue: '0' },
          networkId: {
            type: DT.BIGINT,
            references: {
              model: 'wrap-status-networks',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
            allowNull: false,
          },
          isWrap: { type: DT.BOOLEAN, defaultValue: false },
          createdAt: { type: DT.DATE },
          updatedAt: { type: DT.DATE },
        },
        { transaction: t },
      );

      await QI.bulkInsert(
        'wrap-status-block-numbers',
        [
          {
            networkId: WRAP_STATUS_NETWORKS_IDS.ETH,
            isWrap: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            networkId: WRAP_STATUS_NETWORKS_IDS.POLYGON,
            isWrap: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            networkId: WRAP_STATUS_NETWORKS_IDS.ETH,
            isWrap: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            networkId: WRAP_STATUS_NETWORKS_IDS.POLYGON,
            isWrap: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            networkId: WRAP_STATUS_NETWORKS_IDS.FIO,
            isWrap: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction: t },
      );

      await QI.createTable(
        'wrap-status-eth-unwrap-logs',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          transactionHash: { type: DT.STRING, allowNull: false },
          address: { type: DT.STRING, allowNull: false },
          blockNumber: { type: DT.STRING, allowNull: false },
          amount: { type: DT.STRING, allowNull: false },
          fioAddress: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );
      await QI.createTable(
        'wrap-status-polygon-unwrap-logs',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          transactionHash: { type: DT.STRING, allowNull: false },
          address: { type: DT.STRING, allowNull: false },
          blockNumber: { type: DT.STRING, allowNull: false },
          domain: { type: DT.STRING, allowNull: false },
          fioAddress: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );

      await QI.createTable(
        'wrap-status-eth-wrap-logs',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          transactionHash: { type: DT.STRING, allowNull: false },
          obtId: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );
      await QI.createTable(
        'wrap-status-polygon-wrap-logs',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          transactionHash: { type: DT.STRING, allowNull: false },
          obtId: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );

      await QI.createTable(
        'wrap-status-fio-unwrap-nfts-logs',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          obtId: { type: DT.STRING, allowNull: false },
          isComplete: { type: DT.BOOLEAN, defaultValue: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );
      await QI.createTable(
        'wrap-status-fio-unwrap-tokens-logs',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          obtId: { type: DT.STRING, allowNull: false },
          isComplete: { type: DT.BOOLEAN, defaultValue: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );

      await QI.createTable(
        'wrap-status-fio-wrap-nft-logs',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          transactionId: { type: DT.STRING, allowNull: false },
          address: { type: DT.STRING, allowNull: false },
          domain: { type: DT.STRING, allowNull: false },
          blockNumber: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );

      return QI.createTable(
        'wrap-status-fio-wrap-tokens-logs',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          transactionId: { type: DT.STRING, allowNull: false },
          address: { type: DT.STRING, allowNull: false },
          amount: { type: DT.STRING, allowNull: false },
          blockNumber: { type: DT.STRING, allowNull: false },
          data: { type: DT.JSON },
        },
        { transaction: t },
      );
    });
  },

  down: async QI => {
    await QI.dropTable('wrap-status-block-numbers');
    await QI.dropTable('wrap-status-networks');
    await QI.dropTable('wrap-status-eth-unwrap-logs');
    await QI.dropTable('wrap-status-polygon-unwrap-logs');
    await QI.dropTable('wrap-status-eth-wrap-logs');
    await QI.dropTable('wrap-status-polygon-wrap-logs');
    await QI.dropTable('wrap-status-fio-unwrap-nfts-logs');
    await QI.dropTable('wrap-status-fio-unwrap-tokens-logs');
    await QI.dropTable('wrap-status-fio-wrap-nft-logs');
    return QI.dropTable('wrap-status-fio-wrap-tokens-logs');
  },
};
