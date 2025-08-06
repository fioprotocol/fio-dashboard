import { FIO_ADDRESS_DELIMITER } from '../config/constants';
import { DOMAIN_EXP_DEBUG_AFFIX, DOMAIN_EXP_IN_30_DAYS } from '../constants/fio.mjs';
import { SECOND_MS } from '../config/constants.js';

import { convertToNewDate } from './general.mjs';
import { fioApi, FIO_ACTION_NAMES } from '../external/fio.mjs';
import { sleep } from '../tools.mjs';
import MathOp from '../services/math.mjs';
import config from '../config/index.mjs';
import logger from '../logger.mjs';

export const isDomain = fioName => fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;

export const isDomainExpired = (domainName, expiration) => {
  if (
    process.env.EMAILS_JOB_SIMULATION_EXPIRING_DOMAIN_ENABLED === 'true' &&
    domainName.includes(DOMAIN_EXP_DEBUG_AFFIX) &&
    !domainName.includes(DOMAIN_EXP_IN_30_DAYS)
  ) {
    return true;
  }

  const today = new Date();

  const expirationDay = new Date(convertToNewDate(expiration));

  expirationDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return expirationDay <= today;
};

export const handleExpiredDomains = async ({ domainsList }) => {
  for (const domainItem of domainsList) {
    if (domainItem && domainItem.name) {
      try {
        const domainFromChain = await fioApi.getFioDomain(domainItem.name);

        if (!domainFromChain) {
          domainItem.isExpired = true;
        } else {
          const { expiration } = domainFromChain;

          const isExpired = isDomainExpired(domainItem.name, expiration);

          if (isExpired) {
            domainItem.isExpired = true;
          }
        }
      } catch (error) {
        logger.error('HANDLE EXPIRED DOMAIN ERROR:', error);
        domainItem.isExpired = true;
      }
    }
  }
  return domainsList;
};

export const normalizeFioHandle = fioHandle => {
  if (!fioHandle) return null;

  // Using 'let' to allow for future FIO Handle normalization rules
  let normalizedFioHandle = fioHandle;

  normalizedFioHandle = normalizedFioHandle.toLowerCase();

  return normalizedFioHandle;
};

/**
 * Search for a transaction in FIO history by action and FIO name/domain
 * @param {Object} params - Search parameters
 * @param {Object} params.fioHistory - FIO history instance
 * @param {string} params.action - The action to search for (e.g., GenericAction.renewFioDomain)
 * @param {string} params.fioName - The full FIO name (address@domain) to search for
 * @param {string} params.domain - The domain to search for
 * @param {Array} params.accountsList - List of accounts to search through
 * @param {Object} params.searchParams - Base search parameters for history request
 * @param {string} [params.loggerPrefix] - Optional prefix for log messages
 * @param {Object} [params.blockchainTransaction] - Blockchain transaction object with createdAt/updatedAt for precise time window
 * @returns {Object|null} - Found transaction or null if not found
 *
 * @description
 * When blockchainTransaction is provided, uses a precise time window:
 * - Start: 5 minutes before blockchainTransaction.createdAt
 * - End: configurable via config.cronJobs.fioHistorySearchWindowMinutes (default 180 minutes/3 hours) after createdAt
 * - Falls back to broader search if precise window finds nothing
 */
export const searchTransactionInHistory = async ({
  fioHistory,
  action,
  fioName,
  domain,
  accountsList,
  searchParams,
  loggerPrefix = '',
  blockchainTransaction = null,
}) => {
  let foundTransaction = null;

  // Create a more precise time window if blockchain transaction info is available
  let adjustedSearchParams = { ...searchParams };
  let usingPreciseTimeWindow = false;
  if (
    blockchainTransaction &&
    blockchainTransaction.createdAt &&
    blockchainTransaction.updatedAt
  ) {
    // Start searching from 5 minutes before createdAt to catch transactions that might be slightly earlier
    const searchStartTime = new Date(
      new Date(blockchainTransaction.createdAt).getTime() - 5 * 60 * 1000,
    ).toISOString();

    // End time configurable via env var (in minutes), default 3 hours (180 minutes)
    const searchWindowMinutes =
      parseInt(config.cronJobs.fioHistorySearchWindowMinutes) || 180;
    const searchEndTime = new Date(
      new Date(blockchainTransaction.createdAt).getTime() +
        searchWindowMinutes * 60 * 1000,
    ).toISOString();

    adjustedSearchParams = {
      ...searchParams,
      after: searchStartTime,
      before: searchEndTime,
    };
    usingPreciseTimeWindow = true;

    if (loggerPrefix) {
      logger.info(
        `${loggerPrefix} Using precise time window: ${searchStartTime} to ${searchEndTime} (${searchWindowMinutes} min window)`,
      );
    }
  }

  const findMissedTxInAccountHistoryActions = async params => {
    const accountHistoryActions = await fioHistory.requestHistoryActions({
      params,
    });

    if (accountHistoryActions && accountHistoryActions.actions) {
      const foundMissedTx = accountHistoryActions.actions.find(
        ({ act }) =>
          act.name === FIO_ACTION_NAMES[action] &&
          act.data &&
          (act.data.fio_address === fioName ||
            act.data.fio_domain === (domain || fioName)),
      );

      if (foundMissedTx) {
        foundTransaction = foundMissedTx;
      } else if (
        !foundMissedTx &&
        new MathOp(accountHistoryActions.total.value).gt(
          accountHistoryActions.actions.length,
        )
      ) {
        const lastActionItem =
          accountHistoryActions.actions[accountHistoryActions.actions.length - 1];

        if (loggerPrefix) {
          logger.info(
            `${loggerPrefix} Get More Items before: ${lastActionItem.timestamp}`,
          );
        }
        await sleep(SECOND_MS);
        await findMissedTxInAccountHistoryActions({
          ...params,
          before: lastActionItem.timestamp,
        });
      }
    }
  };

  for (const account of accountsList) {
    if (loggerPrefix) {
      logger.info(`${loggerPrefix} Getting for account: ${account}`);
    }

    const accountSearchParams = {
      account,
      ...adjustedSearchParams,
    };

    await findMissedTxInAccountHistoryActions(accountSearchParams);

    if (foundTransaction) {
      break;
    }
  }

  // If we used a precise time window and didn't find anything, fallback to broader search
  if (!foundTransaction && usingPreciseTimeWindow) {
    if (loggerPrefix) {
      logger.info(
        `${loggerPrefix} Precise time window search failed, falling back to broader search`,
      );
    }

    // Fallback to original search parameters (broader time range)
    for (const account of accountsList) {
      if (loggerPrefix) {
        logger.info(`${loggerPrefix} Fallback search for account: ${account}`);
      }

      const fallbackSearchParams = {
        account,
        ...searchParams, // Use original search params (broader range)
      };

      await findMissedTxInAccountHistoryActions(fallbackSearchParams);

      if (foundTransaction) {
        if (loggerPrefix) {
          logger.info(
            `${loggerPrefix} Found transaction in fallback search for account: ${account}`,
          );
        }
        break;
      }
    }
  }

  return foundTransaction;
};
