import Sequelize from 'sequelize';

import { Action } from '@fioprotocol/fiosdk';

import Base from './Base';

const { DataTypes: DT, Op } = Sequelize;

export class WrapStatusFioChainEvents extends Base {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        actionType: {
          type: DT.STRING(50),
          allowNull: false,
          comment:
            Action.wrapTokens |
            Action.wrapDomain |
            Action.unwrapTokens |
            Action.unwrapDomain |
            'burndomain' |
            'oravote',
        },
        blockNumber: {
          type: DT.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        transactionId: {
          type: DT.STRING(64),
          allowNull: true,
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
        },
        oracleId: {
          type: DT.BIGINT,
          allowNull: true,
          comment: 'References oracle table entry for wrap operations',
        },
      },
      {
        sequelize,
        tableName: 'wrap-status-fio-chain-events',
        timestamps: true,
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['transaction_id', 'action_type'],
            name: 'unique_fio_action',
          },
          {
            fields: ['action_type'],
            name: 'idx_fio_events_action_type',
          },
          {
            fields: ['block_number'],
            name: 'idx_fio_events_block_number',
          },
          {
            fields: ['transaction_id'],
            name: 'idx_fio_events_transaction',
          },
          {
            fields: ['timestamp'],
            name: 'idx_fio_events_timestamp',
          },
          {
            fields: ['actor'],
            name: 'idx_fio_events_actor',
          },
        ],
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: [
        'id',
        'actionType',
        'blockNumber',
        'transactionId',
        'timestamp',
        'actor',
        'actionData',
        'oracleId',
        'createdAt',
        'updatedAt',
      ],
      minimal: ['id', 'actionType', 'blockNumber', 'transactionId'],
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
      actionType: event.action_type || event.actionType,
      blockNumber: event.block_number || event.blockNumber || 0,
      transactionId: event.transaction_id || event.transactionId,
      timestamp: event.timestamp,
      actor: event.actor,
      actionData: event.action_data || event.actionData,
      oracleId: event.oracle_id || event.oracleId,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['actionData', 'updatedAt'],
      ignoreDuplicates: false,
    });
  }

  /**
   * Get events by action type with optional filters
   * @param {string} actionType - Action type
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>}
   */
  static async getEventsByType(actionType = null, filters = {}) {
    const where = {};

    if (actionType) {
      where.actionType = actionType;
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
      where.timestamp = { [Op.gte]: filters.fromTimestamp };
    }

    if (filters.toTimestamp) {
      where.timestamp = {
        ...(where.timestamp || {}),
        [Op.lte]: filters.toTimestamp,
      };
    }

    if (filters.transactionId) {
      where.transactionId = filters.transactionId;
    }

    if (filters.actor) {
      where.actor = filters.actor;
    }

    if (filters.hasOracleId !== undefined) {
      if (filters.hasOracleId) {
        where.oracleId = { [Op.ne]: null };
      } else {
        where.oracleId = { [Op.is]: null };
      }
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

    return this.findAll(queryOptions);
  }

  /**
   * Get all wrap operations (tokens + domains)
   * @param {Object} filters - Filters
   * @returns {Promise<Array>}
   */
  static async getAllWraps(filters = {}) {
    return this.getEventsByType(null, {
      ...filters,
      actionType: { [Op.in]: [Action.wrapTokens, Action.wrapDomain] },
    });
  }

  /**
   * Get all unwrap operations (tokens + domains)
   * @param {Object} filters - Filters
   * @returns {Promise<Array>}
   */
  static async getAllUnwraps(filters = {}) {
    return this.getEventsByType(null, {
      ...filters,
      actionType: { [Op.in]: [Action.unwrapTokens, Action.unwrapDomain] },
    });
  }

  /**
   * Get wraps without oracle ID match
   * @param {Object} filters - Filters
   * @returns {Promise<Array>}
   */
  static async getWrapsWithoutOracleMatch(filters = {}) {
    return this.findAll({
      where: {
        actionType: { [Op.in]: [Action.wrapTokens, Action.wrapDomain] },
        oracleId: { [Op.is]: null },
        ...(filters.fromBlock && {
          blockNumber: { [Op.gte]: filters.fromBlock },
        }),
        ...(filters.toBlock && { blockNumber: { [Op.lte]: filters.toBlock } }),
      },
      order: [['blockNumber', 'DESC']],
      limit: filters.limit || 100,
    });
  }

  /**
   * Count events by action type
   * @param {string} actionType - Action type
   * @returns {Promise<number>}
   */
  static async countByType(actionType = null) {
    const where = {};
    if (actionType) {
      where.actionType = actionType;
    }
    return this.count({ where });
  }

  /**
   * Get latest event by action type
   * @param {string} actionType - Action type
   * @returns {Promise<Object>}
   */
  static async getLatestEvent(actionType = null) {
    const where = {};
    if (actionType) {
      where.actionType = actionType;
    }

    return this.findOne({
      where,
      order: [['blockNumber', 'DESC']],
    });
  }

  /**
   * Get events by transaction ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Array>}
   */
  static async getEventsByTransaction(transactionId) {
    return this.findAll({
      where: { transactionId },
      order: [['blockNumber', 'ASC']],
    });
  }

  /**
   * Get events by oracle ID
   * @param {number} oracleId - Oracle ID
   * @returns {Promise<Array>}
   */
  static async getEventsByOracleId(oracleId) {
    return this.findAll({
      where: { oracleId },
      order: [['blockNumber', 'DESC']],
    });
  }

  /**
   * Get action statistics
   * @returns {Promise<Object>}
   */
  static async getStatistics() {
    const results = await this.sequelize.query(
      `
      SELECT 
        action_type,
        COUNT(*) as count,
        COUNT(CASE WHEN oracle_id IS NOT NULL THEN 1 END) as with_oracle_id,
        MIN(block_number) as first_block,
        MAX(block_number) as last_block,
        MIN(timestamp) as first_timestamp,
        MAX(timestamp) as last_timestamp
      FROM "wrap-status-fio-chain-events"
      GROUP BY action_type
      ORDER BY action_type
      `,
      {
        type: this.sequelize.QueryTypes.SELECT,
      },
    );

    return results;
  }

  /**
   * Delete old events (for cleanup)
   * @param {number} beforeBlock - Delete events before this block
   * @returns {Promise<number>}
   */
  static async deleteOldEvents(beforeBlock) {
    return this.destroy({
      where: {
        blockNumber: { [Op.lt]: beforeBlock },
      },
    });
  }

  static format(event) {
    if (!event) return null;

    return {
      id: event.id,
      actionType: event.actionType,
      blockNumber: event.blockNumber,
      transactionId: event.transactionId,
      timestamp: event.timestamp,
      actor: event.actor,
      actionData: event.actionData,
      oracleId: event.oracleId,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}
