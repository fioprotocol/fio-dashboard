import Sequelize from 'sequelize';

import Base from './Base';
import { WrapStatusNetworks } from './WrapStatusNetworks.mjs';

const { DataTypes: DT, Op } = Sequelize;

export class WrapStatusEvmChainEvents extends Base {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        networkId: {
          type: DT.BIGINT,
          allowNull: false,
          references: {
            model: 'wrap-status-networks',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
        },
        eventType: {
          type: DT.STRING(50),
          allowNull: false,
          comment: 'wrap | unwrap | burn | oracle_confirmation',
        },
        blockNumber: {
          type: DT.BIGINT,
          allowNull: false,
        },
        blockTimestamp: {
          type: DT.BIGINT,
          allowNull: false,
        },
        transactionHash: {
          type: DT.STRING(66),
          allowNull: false,
        },
        eventData: {
          type: DT.JSONB,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'wrap-status-evm-chain-events',
        timestamps: true,
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['network_id', 'transaction_hash', 'event_type', 'block_number'],
            name: 'unique_evm_event',
          },
          {
            fields: ['network_id', 'event_type'],
            name: 'idx_evm_events_network_type',
          },
          {
            fields: ['block_number'],
            name: 'idx_evm_events_block_number',
          },
          {
            fields: ['transaction_hash'],
            name: 'idx_evm_events_transaction',
          },
          {
            fields: ['block_timestamp'],
            name: 'idx_evm_events_timestamp',
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(WrapStatusNetworks, {
      foreignKey: 'networkId',
      targetKey: 'id',
      as: 'network',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'id',
        'networkId',
        'eventType',
        'blockNumber',
        'blockTimestamp',
        'transactionHash',
        'eventData',
        'createdAt',
        'updatedAt',
      ],
      minimal: ['id', 'eventType', 'blockNumber', 'transactionHash'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  /**
   * Add events to database with upsert
   * @param {Array} events - Array of event objects
   * @returns {Promise}
   */
  static async addEvents(events) {
    if (!events || events.length === 0) return [];

    const records = events.map(event => ({
      networkId: event.network_id || event.networkId,
      eventType: event.event_type || event.eventType,
      blockNumber: event.block_number || event.blockNumber,
      blockTimestamp: event.block_timestamp || event.blockTimestamp,
      transactionHash: event.transaction_hash || event.transactionHash,
      eventData: event.event_data || event.eventData,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['eventData', 'updatedAt'],
      ignoreDuplicates: false,
    });
  }

  /**
   * Get events by network and type with optional filters
   * @param {number} networkId - Network ID
   * @param {string} eventType - Event type (wrap, unwrap, burn, oracle_confirmation)
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>}
   */
  static async getEventsByNetwork(networkId, eventType = null, filters = {}) {
    const where = { networkId };

    if (eventType) {
      where.eventType = eventType;
    }

    if (filters.fromBlock) {
      where.blockNumber = { [Op.gte]: filters.fromBlock };
    }

    if (filters.toBlock) {
      where.blockNumber = {
        ...(where.blockNumber || {}),
        [Op.lte]: filters.toBlock,
      };
    }

    if (filters.fromTimestamp) {
      where.blockTimestamp = { [Op.gte]: filters.fromTimestamp };
    }

    if (filters.toTimestamp) {
      where.blockTimestamp = {
        ...(where.blockTimestamp || {}),
        [Op.lte]: filters.toTimestamp,
      };
    }

    if (filters.transactionHash) {
      where.transactionHash = filters.transactionHash;
    }

    const queryOptions = {
      where,
      order: [['blockNumber', 'ASC']],
    };

    if (filters.limit) {
      queryOptions.limit = filters.limit;
    }

    if (filters.offset) {
      queryOptions.offset = filters.offset;
    }

    if (filters.includeNetwork) {
      queryOptions.include = [
        {
          model: WrapStatusNetworks,
          as: 'network',
          attributes: ['id', 'name'],
        },
      ];
    }

    return this.findAll(queryOptions);
  }

  /**
   * Get events count by network and type
   * @param {number} networkId - Network ID
   * @param {string} eventType - Event type
   * @returns {Promise<number>}
   */
  static async countEventsByNetwork(networkId, eventType = null) {
    const where = { networkId };
    if (eventType) {
      where.eventType = eventType;
    }
    return this.count({ where });
  }

  /**
   * Get latest event by network and type
   * @param {number} networkId - Network ID
   * @param {string} eventType - Event type
   * @returns {Promise<Object>}
   */
  static async getLatestEvent(networkId, eventType = null) {
    const where = { networkId };
    if (eventType) {
      where.eventType = eventType;
    }

    return this.findOne({
      where,
      order: [['blockNumber', 'DESC']],
    });
  }

  /**
   * Get events by transaction hash
   * @param {string} transactionHash - Transaction hash
   * @returns {Promise<Array>}
   */
  static async getEventsByTransaction(transactionHash) {
    return this.findAll({
      where: { transactionHash },
      order: [['blockNumber', 'ASC']],
    });
  }

  /**
   * Get wrap events with oracle confirmations
   * @param {number} networkId - Network ID
   * @param {Object} filters - Filters
   * @returns {Promise<Array>}
   */
  static async getWrapsWithConfirmations(networkId, filters = {}) {
    const wrapEvents = await this.getEventsByNetwork(networkId, 'wrap', filters);

    // Get oracle confirmations for these wraps
    const transactionHashes = wrapEvents.map(e => e.transactionHash);

    if (transactionHashes.length === 0) return [];

    const confirmations = await this.findAll({
      where: {
        networkId,
        eventType: 'oracle_confirmation',
        transactionHash: { [Op.in]: transactionHashes },
      },
    });

    // Group confirmations by transaction hash
    const confirmationsByTx = confirmations.reduce((acc, conf) => {
      if (!acc[conf.transactionHash]) {
        acc[conf.transactionHash] = [];
      }
      acc[conf.transactionHash].push(conf);
      return acc;
    }, {});

    // Attach confirmations to wrap events
    return wrapEvents.map(wrapEvent => ({
      ...wrapEvent.toJSON(),
      oracleConfirmations: confirmationsByTx[wrapEvent.transactionHash] || [],
    }));
  }

  /**
   * Delete old events (for cleanup)
   * @param {number} networkId - Network ID
   * @param {number} beforeBlock - Delete events before this block
   * @returns {Promise<number>}
   */
  static async deleteOldEvents(networkId, beforeBlock) {
    return this.destroy({
      where: {
        networkId,
        blockNumber: { [Op.lt]: beforeBlock },
      },
    });
  }

  static format(event) {
    if (!event) return null;

    return {
      id: event.id,
      networkId: event.networkId,
      eventType: event.eventType,
      blockNumber: event.blockNumber,
      blockTimestamp: event.blockTimestamp,
      transactionHash: event.transactionHash,
      eventData: event.eventData,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      network: event.network ? WrapStatusNetworks.format(event.network) : null,
    };
  }
}
