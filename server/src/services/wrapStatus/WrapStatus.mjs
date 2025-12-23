import Sequelize from 'sequelize';
import { Action } from '@fioprotocol/fiosdk';

import Base from '../Base';
import {
  WrapStatusEvmChainEvents,
  WrapStatusFioChainEvents,
} from '../../models/index.mjs';
import {
  normalizeWrapData,
  normalizeUnwrapData,
  normalizeBurnData,
  filterWrapItemsByDateRange,
  extractDomainBurnValue,
  extractDomainBurnTokeIdfromObtid,
} from '../../utils/wrap.mjs';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, MAX_LIMIT } from '../../constants/general.mjs';
import { WRAP_STATUS_NETWORKS_IDS } from '../../config/constants';
import { CHAIN_CODES } from '../../constants/chain.mjs';

const { Op } = Sequelize;

const ACTION_DATA_EVM_COLUMN = 'event_data';
const ACTION_DATA_FIO_COLUMN = 'action_data';

export default class WrapStatus extends Base {
  static get validationRules() {
    return {
      action: ['required', 'string', { one_of: ['wrap', 'unwrap', 'burned'] }],
      assetType: ['required', 'string', { one_of: ['tokens', 'domains'] }],
      chain: ['string'],
      offset: ['integer', { min_number: 0 }],
      limit: ['integer', { min_number: 0 }, { max_number: MAX_LIMIT }],
      filters: [
        {
          nested_object: {
            createdAt: 'string',
            dateRange: [
              {
                nested_object: {
                  startDate: 'integer',
                  endDate: 'integer',
                },
              },
            ],
          },
        },
      ],
    };
  }

  async execute({
    action,
    assetType,
    chain = null,
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
    filters,
  }) {
    const handler = this.getHandler(action, assetType);

    if (!handler) {
      throw new Error(
        `Invalid combination: action="${action}", assetType="${assetType}"`,
      );
    }

    return await handler.call(this, {
      action,
      chain,
      limit,
      offset,
      filters,
    });
  }

  getHandler(action, assetType) {
    const handlers = {
      wrap_tokens: this.handleWrapTokens,
      wrap_domains: this.handleWrapDomains,
      unwrap_tokens: this.handleUnwrapTokens,
      unwrap_domains: this.handleUnwrapDomains,
      burned_domains: this.handleBurnDomains,
    };
    return handlers[`${action}_${assetType}`];
  }

  async handleWrapTokens({ chain, limit, offset, filters }) {
    const validChains = [CHAIN_CODES.ETH, CHAIN_CODES.BASE];
    const chainUpper = chain ? chain.toUpperCase() : null;

    if (chainUpper && !validChains.includes(chainUpper)) {
      throw new Error(
        `Invalid chain for token wraps: ${chain}. Supported: ${validChains.join(', ')}`,
      );
    }

    const networkId = chainUpper ? WRAP_STATUS_NETWORKS_IDS[chainUpper] : null;

    const where = {
      actionType: Action.wrapTokens,
      ...(chainUpper && {
        actionData: {
          [Op.contains]: { chain_code: chainUpper },
        },
      }),
    };

    if (filters && filters.dateRange) {
      where.timestamp = {
        [Op.gte]: new Date(filters.dateRange.startDate),
        [Op.lte]: new Date(filters.dateRange.endDate),
      };
    } else if (filters && filters.createdAt) {
      // Apply createdAt filter in database query for accurate pagination
      where.timestamp = {
        [Op.gte]: new Date(filters.createdAt),
      };
    }

    const fioWraps = await WrapStatusFioChainEvents.findAll({
      where,
      order: [['blockNumber', 'DESC']],
      limit,
      offset,
    });

    const count = await WrapStatusFioChainEvents.count({
      where,
    });
    const enrichedList = await Promise.all(
      fioWraps.map(wrap => this.enrichTokenWrap(wrap, networkId)),
    );
    let normalizedList = enrichedList.map(item => normalizeWrapData(item));

    // Only apply client-side filtering if dateRange is used (since createdAt is already applied in DB)
    if (filters && filters.dateRange) {
      normalizedList = filterWrapItemsByDateRange({
        createdAt: null,
        dateRange: filters.dateRange,
        normalizedWrapItemsData: normalizedList,
      });
    }

    return { data: { list: normalizedList, maxCount: count } };
  }

  async handleWrapDomains({ chain, limit, offset, filters }) {
    const validChains = [CHAIN_CODES.POL, CHAIN_CODES.MATIC];
    const chainUpper = chain.toUpperCase();

    if (chainUpper && !validChains.includes(chainUpper)) {
      throw new Error(
        `Invalid chain for domain wraps: ${chain}. Supported: ${validChains.join(', ')}`,
      );
    }

    const networkId = WRAP_STATUS_NETWORKS_IDS.POLYGON;
    const where = { actionType: Action.wrapDomain };

    if (filters && filters.dateRange) {
      where.timestamp = {
        [Op.gte]: new Date(filters.dateRange.startDate),
        [Op.lte]: new Date(filters.dateRange.endDate),
      };
    } else if (filters && filters.createdAt) {
      // Apply createdAt filter in database query for accurate pagination
      where.timestamp = {
        [Op.gte]: new Date(filters.createdAt),
      };
    }

    const fioWraps = await WrapStatusFioChainEvents.findAll({
      where,
      order: [['blockNumber', 'DESC']],
      limit,
      offset,
    });

    const count = await WrapStatusFioChainEvents.count({
      where,
    });
    const enrichedList = await Promise.all(
      fioWraps.map(wrap => this.enrichDomainWrap(wrap, networkId)),
    );

    let normalizedList = enrichedList.map(item => normalizeWrapData(item));

    // Only apply client-side filtering if dateRange is used (since createdAt is already applied in DB)
    if (filters && filters.dateRange) {
      normalizedList = filterWrapItemsByDateRange({
        createdAt: null,
        dateRange: filters.dateRange,
        normalizedWrapItemsData: normalizedList,
      });
    }

    return { data: { list: normalizedList, maxCount: count } };
  }

  async handleUnwrapTokens({ chain, limit, offset, filters }) {
    const validChains = [CHAIN_CODES.ETH, CHAIN_CODES.BASE];
    const chainUpper = chain.toUpperCase();

    if (chainUpper && !validChains.includes(chainUpper)) {
      throw new Error(
        `Invalid chain for token unwraps: ${chain}. Supported: ${validChains.join(', ')}`,
      );
    }

    const networkId = WRAP_STATUS_NETWORKS_IDS[chainUpper];
    const where = { networkId, eventType: 'unwrap' };

    if (filters && filters.dateRange) {
      where.blockTimestamp = {
        [Op.gte]: Math.floor(new Date(filters.dateRange.startDate).getTime() / 1000),
        [Op.lte]: Math.floor(new Date(filters.dateRange.endDate).getTime() / 1000),
      };
    } else if (filters && filters.createdAt) {
      // Apply createdAt filter in database query for accurate pagination
      where.blockTimestamp = {
        [Op.gte]: Math.floor(new Date(filters.createdAt).getTime() / 1000),
      };
    }

    const evmUnwraps = await WrapStatusEvmChainEvents.findAll({
      where,
      order: [['blockNumber', 'DESC']],
      limit,
      offset,
    });

    const count = await WrapStatusEvmChainEvents.count({
      where,
    });
    const enrichedList = await Promise.all(
      evmUnwraps.map(unwrap => this.enrichTokenUnwrap(unwrap)),
    );

    let normalizedList = enrichedList.map(item =>
      normalizeUnwrapData({ ...item, chainCode: chainUpper }),
    );

    // Only apply client-side filtering if dateRange is used (since createdAt is already applied in DB)
    if (filters && filters.dateRange) {
      normalizedList = filterWrapItemsByDateRange({
        createdAt: null,
        dateRange: filters.dateRange,
        normalizedWrapItemsData: normalizedList,
      });
    }

    return { data: { list: normalizedList, maxCount: count } };
  }

  async handleUnwrapDomains({ chain, limit, offset, filters }) {
    const validChains = [CHAIN_CODES.POL, CHAIN_CODES.MATIC];
    const chainUpper = chain ? chain.toUpperCase() : null;

    if (chainUpper && !validChains.includes(chainUpper)) {
      throw new Error(
        `Invalid chain for domain unwraps: ${chain}. Supported: ${validChains.join(
          ', ',
        )}`,
      );
    }

    const networkId = WRAP_STATUS_NETWORKS_IDS.POLYGON;
    const where = { networkId, eventType: 'unwrap' };

    if (filters && filters.dateRange) {
      where.blockTimestamp = {
        [Op.gte]: Math.floor(new Date(filters.dateRange.startDate).getTime() / 1000),
        [Op.lte]: Math.floor(new Date(filters.dateRange.endDate).getTime() / 1000),
      };
    } else if (filters && filters.createdAt) {
      // Apply createdAt filter in database query for accurate pagination
      where.blockTimestamp = {
        [Op.gte]: Math.floor(new Date(filters.createdAt).getTime() / 1000),
      };
    }

    const polygonUnwraps = await WrapStatusEvmChainEvents.findAll({
      where,
      order: [['blockNumber', 'DESC']],
      limit,
      offset,
    });

    const count = await WrapStatusEvmChainEvents.count({
      where,
    });
    const enrichedList = await Promise.all(
      polygonUnwraps.map(unwrap => this.enrichDomainUnwrap(unwrap)),
    );
    let normalizedList = enrichedList.map(item =>
      normalizeUnwrapData({ ...item, chainCode: chainUpper }),
    );

    // Only apply client-side filtering if dateRange is used (since createdAt is already applied in DB)
    if (filters && filters.dateRange) {
      normalizedList = filterWrapItemsByDateRange({
        createdAt: null,
        dateRange: filters.dateRange,
        normalizedWrapItemsData: normalizedList,
      });
    }

    return { data: { list: normalizedList, maxCount: count } };
  }

  async handleBurnDomains({ chain, limit, offset, filters }) {
    const validChains = [CHAIN_CODES.MATIC, CHAIN_CODES.POL];
    const chainUpper = chain.toUpperCase();

    if (chainUpper && !validChains.includes(chainUpper)) {
      throw new Error(
        `Invalid chain for domain burns: ${chain}. Supported: ${validChains.join(', ')}`,
      );
    }

    const networkId = WRAP_STATUS_NETWORKS_IDS.POLYGON;
    const where = {
      actionType: 'burndomain',
    };

    if (filters && filters.dateRange) {
      where.timestamp = {
        [Op.gte]: new Date(filters.dateRange.startDate),
        [Op.lte]: new Date(filters.dateRange.endDate),
      };
    } else if (filters && filters.createdAt) {
      // Apply createdAt filter in database query for accurate pagination
      where.timestamp = {
        [Op.gte]: new Date(filters.createdAt),
      };
    }

    const fioBurns = await WrapStatusFioChainEvents.findAll({
      where,
      order: [['blockNumber', 'DESC']],
      limit,
      offset,
    });

    const count = await WrapStatusFioChainEvents.count({
      where,
    });
    const enrichedList = await Promise.all(
      fioBurns.map(burn => this.enrichBurnedDomain(burn, networkId)),
    );

    let normalizedList = enrichedList.map(item =>
      normalizeBurnData({ ...item, chainCode: chainUpper }),
    );

    // Only apply client-side filtering if dateRange is used (since createdAt is already applied in DB)
    if (filters && filters.dateRange) {
      normalizedList = filterWrapItemsByDateRange({
        createdAt: null,
        dateRange: filters.dateRange,
        normalizedWrapItemsData: normalizedList,
      });
    }

    return {
      data: {
        list: normalizedList,
        maxCount: count,
      },
    };
  }

  async enrichTokenWrap(fioWrap, networkId) {
    const { transactionId, oracleId, actionData, blockNumber, timestamp } = fioWrap;
    const obtIdWhere = this.buildObtIdWhere({
      transactionId,
      oracleId,
      column: ACTION_DATA_EVM_COLUMN,
    });

    const wrapConfirmation = await WrapStatusEvmChainEvents.findOne({
      where: {
        networkId,
        eventType: 'wrap',
        ...obtIdWhere,
      },
    });

    const oracleConfirmations = await WrapStatusEvmChainEvents.findAll({
      where: {
        networkId,
        eventType: 'oracle_confirmation',
        ...obtIdWhere,
      },
    });

    return {
      transactionId,
      address: actionData.public_address || actionData.address,
      amount: actionData.amount,
      blockNumber: blockNumber.toString(),
      oracleId: oracleId ? oracleId.toString() : null,
      data: {
        act: { data: actionData, name: Action.wrapTokens },
        timestamp: timestamp.toISOString().replace('Z', ''),
      },
      confirmData: wrapConfirmation
        ? {
            blockNumber: wrapConfirmation.blockNumber.toString(),
            blockTimeStamp: wrapConfirmation.blockTimestamp.toString(),
            transactionHash: wrapConfirmation.transactionHash,
            isComplete: true,
          }
        : null,
      oravotes: oracleConfirmations.map(conf => ({
        returnValues: conf.eventData.returnValues || {},
        transactionHash: conf.transactionHash,
      })),
    };
  }

  async enrichDomainWrap(fioWrap, networkId) {
    const { transactionId, oracleId, actionData, blockNumber, timestamp } = fioWrap;

    const obtIdWhere = this.buildObtIdWhere({
      transactionId,
      oracleId,
      column: ACTION_DATA_EVM_COLUMN,
    });

    const wrapConfirmation = await WrapStatusEvmChainEvents.findOne({
      where: {
        networkId,
        eventType: Action.wrapDomain,
        ...obtIdWhere,
      },
    });

    const oracleConfirmations = await WrapStatusEvmChainEvents.findAll({
      where: {
        networkId,
        eventType: 'oracle_confirmation',
        ...obtIdWhere,
      },
      order: [['blockNumber', 'DESC']],
    });

    // Set confirmData: prefer wrap confirmation, but if not available and we have oracle confirmations,
    // use the latest oracle confirmation for block info (matching old logic structure)
    let confirmData = null;
    if (wrapConfirmation) {
      confirmData = {
        blockNumber: wrapConfirmation.blockNumber.toString(),
        blockTimeStamp: wrapConfirmation.blockTimestamp.toString(),
        transactionHash: wrapConfirmation.transactionHash,
        isComplete: true,
      };
    } else if (oracleConfirmations.length > 0) {
      // Use latest oracle confirmation for block info display (same as old logic)
      const latestOracleConf = oracleConfirmations[0];
      confirmData = {
        blockNumber: latestOracleConf.blockNumber.toString(),
        blockTimeStamp: latestOracleConf.blockTimestamp.toString(),
        transactionHash: latestOracleConf.transactionHash,
        isComplete: false, // Will be determined in normalizeWrapData based on oracle count
      };
    }

    return {
      transactionId,
      address: actionData.public_address || actionData.address,
      domain: actionData.fio_domain || actionData.domain,
      blockNumber: blockNumber.toString(),
      oracleId: oracleId ? oracleId.toString() : null,
      data: {
        act: { data: actionData, name: Action.wrapDomain },
        timestamp: timestamp.toISOString().replace('Z', ''),
      },
      confirmData,
      oravotes: oracleConfirmations.map(conf => ({
        returnValues: conf.eventData.returnValues || {},
        transactionHash: conf.transactionHash,
      })),
    };
  }

  async enrichTokenUnwrap(evmUnwrap) {
    const { transactionHash, eventData, blockNumber, blockTimestamp } = evmUnwrap;

    const obtIdWhere = this.buildObtIdWhere({
      transactionId: transactionHash,
      column: ACTION_DATA_FIO_COLUMN,
    });

    const fioConfirmations = await WrapStatusFioChainEvents.findAll({
      where: {
        actionType: Action.unwrapTokens,
        ...obtIdWhere,
      },
    });

    const oravotes = await WrapStatusFioChainEvents.findAll({
      where: {
        actionType: 'oravote',
        ...obtIdWhere,
      },
    });

    return {
      transactionHash,
      address:
        (eventData.returnValues ? eventData.returnValues.address : null) ||
        eventData.address,
      blockNumber: blockNumber.toString(),
      amount: eventData.returnValues ? eventData.returnValues.amount : eventData.amount,
      fioAddress: eventData.returnValues
        ? eventData.returnValues.fioaddress
        : eventData.fioAddress,
      data: {
        blockTimeStamp: blockTimestamp.toString(),
        returnValues: eventData.returnValues || eventData,
      },
      confirmData: fioConfirmations.map(conf => ({
        trx_id: conf.transactionId,
        timestamp: conf.timestamp.toISOString().replace('Z', ''),
        data: conf.actionData,
      })),
      oravotes: this.formatOravotes(oravotes),
    };
  }

  async enrichDomainUnwrap(evmUnwrap) {
    const { transactionHash, eventData, blockNumber, blockTimestamp } = evmUnwrap;

    const obtIdWhere = this.buildObtIdWhere({
      transactionId: transactionHash,
      column: ACTION_DATA_FIO_COLUMN,
    });

    const fioConfirmations = await WrapStatusFioChainEvents.findAll({
      where: {
        actionType: Action.unwrapDomain,
        ...obtIdWhere,
      },
    });

    const oravotes = await WrapStatusFioChainEvents.findAll({
      where: {
        actionType: 'oravote',
        ...obtIdWhere,
      },
    });

    return {
      transactionHash,
      address:
        (eventData.returnValues ? eventData.returnValues.address : null) ||
        eventData.address,
      blockNumber: blockNumber.toString(),
      domain:
        (eventData.returnValues ? eventData.returnValues.domain : null) ||
        eventData.domain,
      fioAddress:
        (eventData.returnValues ? eventData.returnValues.fioaddress : null) ||
        eventData.fioAddress,
      data: {
        blockTimeStamp: blockTimestamp.toString(),
        returnValues: eventData.returnValues || eventData,
      },
      confirmData: fioConfirmations.map(conf => ({
        trx_id: conf.transactionId,
        timestamp: conf.timestamp.toISOString().replace('Z', ''),
        data: conf.actionData,
      })),
      oravotes: this.formatOravotes(oravotes),
    };
  }

  async enrichBurnedDomain(fioBurn, networkId) {
    const { transactionId, actionData, blockNumber, timestamp } = fioBurn;
    const domain = actionData.name || actionData.domain;

    if (!domain) {
      return {
        transactionId,
        domain: null,
        blockNumber: blockNumber.toString(),
        data: {
          timestamp: timestamp.toISOString().replace('Z', ''),
          data: actionData,
        },
        confirmData: null,
        oravotes: [],
      };
    }

    // Step 1: Find Polygon burn event
    // Try multiple matching strategies:
    // 1. Match by FIO transaction ID in obtid
    // 2. Match by domain name extracted from obtid
    let burnConfirmation = null;

    // First, try to find by FIO transaction ID (exact match)
    burnConfirmation = await WrapStatusEvmChainEvents.findOne({
      where: {
        networkId,
        eventType: 'burn',
        [Op.or]: [
          // Match obtid = FIO transaction ID
          Sequelize.where(
            Sequelize.fn(
              'jsonb_extract_path_text',
              Sequelize.col('event_data'),
              'returnValues',
              'obtid',
            ),
            transactionId,
          ),
        ],
      },
    });

    // If not found by transaction ID, search by domain name in obtid
    if (!burnConfirmation) {
      const allBurnEvents = await WrapStatusEvmChainEvents.findAll({
        where: {
          networkId,
          eventType: 'burn',
        },
        order: [['blockNumber', 'DESC']],
      });

      // Filter burn events by extracting domain from obtid
      for (const burnEvent of allBurnEvents) {
        const obtid =
          burnEvent.eventData.returnValues && burnEvent.eventData.returnValues.obtid;

        if (!obtid) continue;

        // Extract domain from obtid using utility
        const extractedDomain = extractDomainBurnValue(obtid);

        // Match if extracted domain equals our domain
        if (extractedDomain === domain) {
          burnConfirmation = burnEvent;
          break;
        }

        // Also try direct match
        if (obtid === domain) {
          burnConfirmation = burnEvent;
          break;
        }
      }
    }

    let oravotes = [];
    let tokenId = null;
    let burnObtId = null;

    // Step 2: Extract tokenId and obtid from burn confirmation
    if (burnConfirmation) {
      tokenId =
        burnConfirmation.eventData.tokenId ||
        (burnConfirmation.eventData.returnValues &&
          burnConfirmation.eventData.returnValues.tokenId);

      burnObtId =
        burnConfirmation.eventData.returnValues &&
        burnConfirmation.eventData.returnValues.obtid;
    }

    // Step 3: Find oracle confirmations
    // Try multiple matching strategies:
    // 1. Exact obtid match (if we have burnObtId)
    // 2. Match by FIO transaction ID
    // 3. Match by tokenId + domain pattern
    if (burnObtId) {
      // We have the exact obtid from burn event, use it for exact matching
      const oracleConfirmations = await WrapStatusEvmChainEvents.findAll({
        where: {
          networkId,
          eventType: 'oracle_confirmation',
          [Op.or]: [
            // Exact obtid match
            Sequelize.where(
              Sequelize.fn(
                'jsonb_extract_path_text',
                Sequelize.col('event_data'),
                'returnValues',
                'obtid',
              ),
              burnObtId,
            ),
            // Also try FIO transaction ID match
            Sequelize.where(
              Sequelize.fn(
                'jsonb_extract_path_text',
                Sequelize.col('event_data'),
                'returnValues',
                'obtid',
              ),
              transactionId,
            ),
          ],
        },
        order: [['blockNumber', 'DESC']],
      });

      oravotes = oracleConfirmations.map(conf => ({
        returnValues: {
          account:
            (conf.eventData.returnValues && conf.eventData.returnValues.account) ||
            (conf.eventData.returnValues && conf.eventData.returnValues.signer) ||
            null,
          obtid:
            (conf.eventData.returnValues && conf.eventData.returnValues.obtid) || null,
        },
        transactionHash: conf.transactionHash,
        tokenId: tokenId,
      }));
    } else {
      // No burn confirmation found, try to find oracle confirmations
      // by FIO transaction ID or by domain pattern
      const oracleConfirmations = await WrapStatusEvmChainEvents.findAll({
        where: {
          networkId,
          eventType: 'oracle_confirmation',
          [Op.or]: [
            // Match by FIO transaction ID
            Sequelize.where(
              Sequelize.fn(
                'jsonb_extract_path_text',
                Sequelize.col('event_data'),
                'returnValues',
                'obtid',
              ),
              transactionId,
            ),
            // Match obtid containing the domain
            Sequelize.where(
              Sequelize.fn(
                'jsonb_extract_path_text',
                Sequelize.col('event_data'),
                'returnValues',
                'obtid',
              ),
              { [Op.like]: `%${domain}%` },
            ),
          ],
        },
        order: [['blockNumber', 'DESC']],
      });

      // Filter by extracting and validating domain from obtid
      // (only for non-transaction-hash obtids)
      const validConfirmations = oracleConfirmations.filter(conf => {
        const obtid = conf.eventData.returnValues && conf.eventData.returnValues.obtid;
        if (!obtid) return false;

        // If obtid equals FIO transaction ID, it's valid
        if (obtid === transactionId) return true;

        // Extract domain from obtid
        const extractedValue = extractDomainBurnValue(obtid);

        // The extracted value should match our domain
        return extractedValue === domain;
      });

      // Extract tokenId from first valid confirmation
      if (validConfirmations.length > 0) {
        const firstObtid =
          validConfirmations[0].eventData.returnValues &&
          validConfirmations[0].eventData.returnValues.obtid;
        if (firstObtid) {
          tokenId = extractDomainBurnTokeIdfromObtid(firstObtid);
        }
      }

      oravotes = validConfirmations.map(conf => ({
        returnValues: {
          account:
            (conf.eventData.returnValues && conf.eventData.returnValues.account) ||
            (conf.eventData.returnValues && conf.eventData.returnValues.signer) ||
            null,
          obtid:
            (conf.eventData.returnValues && conf.eventData.returnValues.obtid) || null,
        },
        transactionHash: conf.transactionHash,
        tokenId: tokenId,
      }));
    }

    // Step 4: Determine confirmation status and build confirmData
    const hasEnoughVoters = oravotes.length >= 3;
    let confirmData = null;

    if (burnConfirmation) {
      confirmData = {
        blockNumber: burnConfirmation.blockNumber, // Keep as number
        blockTimeStamp: burnConfirmation.blockTimestamp, // Keep as number (Unix timestamp)
        transactionHash: burnConfirmation.transactionHash,
        obtid: burnObtId,
        tokenId: tokenId,
        isComplete: hasEnoughVoters,
      };
    } else if (oravotes.length > 0) {
      // We have oracle confirmations but no burn event yet
      const firstObtid = oravotes[0].returnValues.obtid;
      confirmData = {
        obtid: firstObtid,
        tokenId: tokenId,
        isComplete: hasEnoughVoters,
      };
    }

    return {
      transactionId,
      domain,
      blockNumber: blockNumber.toString(),
      data: {
        timestamp: timestamp.toISOString().replace('Z', ''),
        data: actionData,
      },
      confirmData,
      oravotes,
    };
  }

  formatOravotes(oravotes) {
    if (oravotes.length === 0) return [];

    const groupedVotes = {};
    for (const vote of oravotes) {
      const voteId = vote.oracleId || vote.id;
      if (!groupedVotes[voteId]) {
        groupedVotes[voteId] = {
          id: voteId,
          voters: [],
          isComplete: false,
        };
      }
      if (vote.actionData.voters) {
        groupedVotes[voteId].voters = vote.actionData.voters;
        groupedVotes[voteId].isComplete = vote.actionData.isComplete || false;
      }
    }
    return Object.values(groupedVotes);
  }

  buildObtIdWhere({ transactionId, oracleId = null, column }) {
    const values = [transactionId, oracleId]
      .filter(value => value !== undefined && value !== null)
      .map(value => value.toString());

    if (values.length === 0) return {};

    const paths = [
      ['returnValues', 'obtid'],
      ['returnValues', 'obtId'],
      ['obtid'],
      ['obtId'],
      ['obt_id'],
    ];

    return {
      [Op.or]: paths.map(path =>
        Sequelize.where(
          Sequelize.fn('jsonb_extract_path_text', Sequelize.col(column), ...path),
          { [Op.in]: values },
        ),
      ),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
