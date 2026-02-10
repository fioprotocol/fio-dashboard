import Sequelize from 'sequelize';

import { Action } from '@fioprotocol/fiosdk';

import Base from './Base';
import config from '../config/index.mjs';
import { FIO_CHAIN_ID } from '../config/constants.js';

const { DataTypes: DT, Op } = Sequelize;

// Early mainnet oravotes (before this ID) had issues due to the initial feature
// rollout and will always appear stale. Skip them to avoid needless API calls.
const MAINNET_MIN_ORAVOTE_ID = 60;

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
      conflictAttributes: ['transactionId', 'actionType'],
      updateOnDuplicate: [
        'blockNumber',
        'timestamp',
        'actor',
        'actionData',
        'oracleId',
        'updatedAt',
      ],
      ignoreDuplicates: false,
    });
  }

  /**
   * Detect which oravotes need re-fetching from the FIO chain.
   * Checks unwrap oravotes (obt_id starts with "0x") where isComplete = 0.
   * Compares voter count against the actual FIO unwrap confirmation tx count.
   * A mismatch means the oravote is stale and needs re-fetching.
   * @returns {Promise<{staleIds: number[], newStartPosition: number}>}
   */
  static async getOravoteRefreshInfo() {
    // On mainnet, skip early oravotes that had issues during the initial rollout.
    const isMainnet = config.fioChain.id === FIO_CHAIN_ID.MAINNET;
    const minOracleId = isMainnet ? MAINNET_MIN_ORAVOTE_ID : 0;

    const oravoteBaseWhere = {
      actionType: 'oravote',
      oracleId: minOracleId > 0 ? { [Op.gte]: minOracleId } : { [Op.ne]: null },
    };

    const lastOravote = await this.findOne({
      where: oravoteBaseWhere,
      order: [['oracleId', 'DESC']],
    });

    if (!lastOravote || !lastOravote.oracleId) {
      return { staleIds: [], newStartPosition: minOracleId || 0 };
    }

    const lastOracleId = parseInt(lastOravote.oracleId);

    // Step 1: Find unwrap oravotes where isComplete is 0 (still in progress).
    // Only unwrap oravotes (obt_id starts with "0x") — wrap oravotes use FIO
    // tx hashes and have no matching FIO unwrap events.
    const incompleteOravotes = await this.findAll({
      where: {
        ...oravoteBaseWhere,
        [Op.and]: [
          Sequelize.literal(`("action_data"->>'isComplete')::int = 0`),
          Sequelize.literal(`"action_data"->>'obt_id' LIKE '0x%'`),
        ],
      },
      attributes: ['oracleId', 'actionData'],
    });

    if (incompleteOravotes.length === 0) {
      return { staleIds: [], newStartPosition: lastOracleId + 1 };
    }

    // Step 2: Collect obt_ids and voter counts
    const oravoteInfo = [];
    const obtIds = [];

    for (const oravote of incompleteOravotes) {
      const obtId = oravote.actionData && oravote.actionData.obt_id;
      const voterCount =
        oravote.actionData && oravote.actionData.voters
          ? oravote.actionData.voters.length
          : 0;

      if (obtId) {
        oravoteInfo.push({
          oracleId: parseInt(oravote.oracleId),
          obtId,
          voterCount,
        });
        obtIds.push(obtId);
      }
    }

    if (obtIds.length === 0) {
      return { staleIds: [], newStartPosition: lastOracleId + 1 };
    }

    // Step 3: Count FIO unwrap confirmation txs for these obt_ids (single query)
    const unwrapConfirmations = await this.findAll({
      where: {
        actionType: { [Op.in]: [Action.unwrapTokens, Action.unwrapDomain] },
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn(
              'jsonb_extract_path_text',
              Sequelize.col('action_data'),
              'obt_id',
            ),
            { [Op.in]: obtIds },
          ),
        ],
      },
      attributes: ['actionData'],
    });

    const txCountByObtId = {};
    for (const event of unwrapConfirmations) {
      const obtId = event.actionData && event.actionData.obt_id;
      if (obtId) {
        txCountByObtId[obtId] = (txCountByObtId[obtId] || 0) + 1;
      }
    }

    // Step 4: Find oravotes where tx count differs from voter count (stale data)
    const staleIds = oravoteInfo
      .filter(({ obtId, voterCount }) => (txCountByObtId[obtId] || 0) !== voterCount)
      .map(({ oracleId }) => oracleId);

    return {
      staleIds,
      newStartPosition: lastOracleId + 1,
      // Diagnostic info for logging
      _debug: {
        isMainnet,
        minOracleId,
        incompleteCount: incompleteOravotes.length,
        candidateCount: oravoteInfo.length,
        staleDetails: oravoteInfo
          .filter(({ obtId, voterCount }) => (txCountByObtId[obtId] || 0) !== voterCount)
          .map(({ oracleId, obtId, voterCount }) => ({
            oracleId,
            voterCount,
            txCount: txCountByObtId[obtId] || 0,
          })),
      },
    };
  }

  /**
   * Upsert oravote events by oracle_id.
   * Standard addEvents() cannot be used for oravotes because transaction_id
   * is NULL, and PostgreSQL treats NULLs as distinct in unique constraints,
   * so ON CONFLICT (transaction_id, action_type) never matches.
   * @param {Array} events - Array of oravote event objects
   * @returns {Promise<Array>}
   */
  static async addOrUpdateOravotes(events) {
    if (!events || events.length === 0) return { created: 0, updated: 0 };

    let createdCount = 0;
    let updatedCount = 0;

    for (const event of events) {
      const oracleId = event.oracle_id || event.oracleId;
      const actionData = event.action_data || event.actionData;

      if (!oracleId) continue;

      const [instance, created] = await this.findOrCreate({
        where: {
          oracleId,
          actionType: 'oravote',
        },
        defaults: {
          actionType: 'oravote',
          blockNumber: event.block_number || event.blockNumber || 0,
          transactionId: event.transaction_id || event.transactionId || null,
          timestamp: event.timestamp || new Date(),
          actor: event.actor || null,
          actionData,
          oracleId,
        },
      });

      if (created) {
        createdCount++;
      } else {
        await instance.update({ actionData });
        updatedCount++;
      }
    }

    // Clean up orphan oravote records with NULL oracleId (duplicates from
    // the old addEvents code that couldn't properly upsert oravotes).
    if (createdCount > 0 || updatedCount > 0) {
      await this.destroy({
        where: {
          actionType: 'oravote',
          oracleId: { [Op.is]: null },
        },
      });
    }

    return { created: createdCount, updated: updatedCount };
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
