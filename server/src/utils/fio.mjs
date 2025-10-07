import { GenericAction } from '@fioprotocol/fiosdk';

import { FIO_ADDRESS_DELIMITER } from '../config/constants';
import {
  DOMAIN_EXP_DEBUG_AFFIX,
  DOMAIN_EXP_IN_30_DAYS,
  DOMAIN_HAS_TOO_LONG_RENEWAL_PERIOD,
  TOO_LONG_DOMAIN_RENEWAL_YEAR,
} from '../constants/fio.mjs';
import { SECOND_MS, FIO_PROXY_LIST } from '../config/constants.js';
import { HTTP_CODES } from '../constants/general.mjs';

import { convertToNewDate } from './general.mjs';
import { fioApi, FIO_ACTION_NAMES } from '../external/fio.mjs';
import { sleep } from '../tools.mjs';
import MathOp from '../services/math.mjs';
import config from '../config/index.mjs';
import logger from '../logger.mjs';

import { Payment } from '../models/Payment.mjs';
import { FioAccountProfile } from '../models/FioAccountProfile.mjs';

export const isDomain = fioName => fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;

export const isDomainExpired = (domainName, expiration) => {
  if (
    config.testingFlags.domainExpiration === 'true' &&
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

export const handleTooLongDomainRenewal = async ({ domainName }) => {
  const domainFromChain = await fioApi.getFioDomain(domainName);

  if (!domainFromChain) {
    return false;
  }

  const { expiration } = domainFromChain;

  if (
    config.testingFlags.domainExpiration === 'true' &&
    DOMAIN_HAS_TOO_LONG_RENEWAL_PERIOD.includes(domainName)
  ) {
    return true;
  }

  // Create max year date (January 1st of the max year)
  const maxRenewalDate = new Date(TOO_LONG_DOMAIN_RENEWAL_YEAR, 0, 1);

  // Convert expiration timestamp to Date and add the period (years)
  const expirationDate = new Date(convertToNewDate(expiration));

  const renewalEndDate = new Date(expirationDate);
  renewalEndDate.setFullYear(renewalEndDate.getFullYear() + 1); // Because we don't have a period for api renewal calls we add on year as the expiration year

  // Reset time components for consistent comparison
  renewalEndDate.setHours(0, 0, 0, 0);
  maxRenewalDate.setHours(0, 0, 0, 0);

  return renewalEndDate >= maxRenewalDate;
};

export const normalizeFioHandle = fioHandle => {
  if (!fioHandle) return null;

  // Using 'let' to allow for future FIO Handle normalization rules
  let normalizedFioHandle = fioHandle;

  normalizedFioHandle = normalizedFioHandle.toLowerCase();

  return normalizedFioHandle;
};

const sanitizeProxyList = proxies => {
  return Array.from(
    new Set(
      proxies
        .filter(Boolean)
        .map(proxy => proxy.trim())
        .filter(Boolean),
    ),
  );
};

const pickProxiesSource = ({ chainProxies, fallbackProxies }) =>
  !chainProxies.length && fallbackProxies.length ? fallbackProxies : chainProxies;

const parseStatusCode = candidate => {
  if (candidate == null) return null;
  const numeric = Number(candidate);
  return Number.isFinite(numeric) ? numeric : null;
};

const getStatusFromResult = result => {
  const status =
    parseStatusCode(result && result.statusCode) ||
    parseStatusCode(result && result.status) ||
    parseStatusCode(result && result.code);

  if (status != null) return status;

  return result && result.public_address ? HTTP_CODES.SUCCESS : HTTP_CODES.NOT_FOUND;
};

const getStatusFromError = error =>
  parseStatusCode(error.statusCode) ||
  parseStatusCode(error.status) ||
  parseStatusCode(error.code) ||
  parseStatusCode(error.errorCode) ||
  parseStatusCode(error.response.status) ||
  parseStatusCode(error.json.status) ||
  500;

const extractErrorMessage = response => {
  if (!response) return null;

  if (response.code === HTTP_CODES.NOT_FOUND) {
    if (response.json.message) return response.json.message;
    if (response.message) return response.message;
    return null;
  }

  if (response.code === HTTP_CODES.BAD_REQUEST) {
    if (response.message) return response.message;
    if (response.json.message) return response.json.message;
    return null;
  }

  if (response.message) return response.message;
  if (response.json.message) return response.json.message;
  if (response.json.error) return response.json.error;
  return null;
};

const resolveProxyStatus = async proxy => {
  try {
    const result = await fioApi.getPublicAddressByFioAddress(proxy);
    const status = getStatusFromResult(result);

    return {
      proxy,
      status,
      error: status === HTTP_CODES.SUCCESS ? null : extractErrorMessage(result),
    };
  } catch (error) {
    const status = getStatusFromError(error);
    return {
      proxy,
      status,
      error: status === HTTP_CODES.SUCCESS ? null : extractErrorMessage(error),
    };
  }
};

export const fetchFioProxyStatuses = async ({
  chainId = process.env.FIO_CHAIN_ID,
} = {}) => {
  const chainRows = await fioApi.getProxyRows();

  const chainProxies = sanitizeProxyList(
    (chainRows || [])
      .filter(row => row.is_proxy && row.fioaddress)
      .map(row => row.fioaddress),
  );

  const fallbackProxies = sanitizeProxyList(FIO_PROXY_LIST[chainId] || []);

  const proxiesToCheck = pickProxiesSource({
    chainProxies,
    fallbackProxies,
  });

  const proxiesStatuses = [];
  for (const proxy of proxiesToCheck) {
    // Sequential requests reduce the chance of hitting API rate limits.
    // The list is small (< 50), so the performance impact is minimal.
    // eslint-disable-next-line no-await-in-loop
    const result = await resolveProxyStatus(proxy);
    proxiesStatuses.push(result);
  }

  return proxiesStatuses;
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

  try {
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
      const searchWindowMinutes = config.cronJobs.fioHistorySearchWindowMinutes
        ? parseInt(config.cronJobs.fioHistorySearchWindowMinutes)
        : 180;
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
      try {
        const accountHistoryActions = await fioHistory.requestHistoryActions({
          params,
        });

        // Validate response structure
        if (!accountHistoryActions || !Array.isArray(accountHistoryActions.actions)) {
          if (loggerPrefix) {
            logger.warn(
              `${loggerPrefix} Invalid response structure from history API: ${JSON.stringify(
                accountHistoryActions,
              )}`,
            );
          }
          return;
        }

        const foundMissedTx = accountHistoryActions.actions.find(
          ({ act }) =>
            act &&
            act.name === FIO_ACTION_NAMES[action] &&
            act.data &&
            (act.data.fio_address === fioName ||
              act.data.fio_domain === (domain || fioName)),
        );

        if (foundMissedTx) {
          foundTransaction = foundMissedTx;
        } else if (
          !foundMissedTx &&
          accountHistoryActions.total &&
          accountHistoryActions.total.value &&
          new MathOp(accountHistoryActions.total.value).gt(
            accountHistoryActions.actions.length,
          )
        ) {
          const lastActionItem =
            accountHistoryActions.actions[accountHistoryActions.actions.length - 1];

          if (lastActionItem && lastActionItem.timestamp) {
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
      } catch (error) {
        // Log error but don't crash the search - try next account or fallback
        if (loggerPrefix) {
          logger.warn(
            `${loggerPrefix} API error in findMissedTxInAccountHistoryActions for account ${params.account}: ${error.message}`,
          );
        }

        // For any error from fetchWithRateLimit, continue to next account/fallback
        // Don't treat as "not found" - these are infrastructure issues
      }
    };

    // Search through all accounts
    for (const account of accountsList) {
      if (!account) continue; // Skip invalid accounts

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
        if (!account) continue; // Skip invalid accounts

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
  } catch (error) {
    // Top-level error handling
    logger.error(`${loggerPrefix} Critical error in searchTransactionInHistory:`, error);

    // Return null instead of throwing to prevent job crashes
    // The calling code should handle null responses appropriately
    return null;
  }
};

/**
 * Build accounts list for transaction searching based on order item data
 * @param {Object} params - Parameters for building accounts list
 * @param {string} [params.publicKey] - Order public key
 * @param {Object} [params.data] - Order item data (may contain signingWalletPubKey)
 * @param {string} [params.paymentProcessor] - Payment processor type
 * @param {string} [params.action] - FIO action type
 * @param {number} [params.total] - Order total amount
 * @returns {Promise<Array<string>>} - Array of unique account actors to search
 */
export const buildAccountsListForSearch = async ({
  publicKey = null,
  data = null,
  paymentProcessor = null,
  action = null,
  total = null,
}) => {
  const accountsList = [];
  let txPublicKey = publicKey;

  // Use the same logic as get-missed-bc-txs.mjs
  if (data && data.signingWalletPubKey) {
    txPublicKey = data.signingWalletPubKey;
  } else if (paymentProcessor) {
    if (
      paymentProcessor === Payment.PROCESSOR.STRIPE ||
      paymentProcessor === Payment.PROCESSOR.BITPAY
    ) {
      txPublicKey = fioApi.getMasterPublicKey();

      const dashboardAccountActions = await FioAccountProfile.getPaidItems();

      if (dashboardAccountActions && dashboardAccountActions.length > 0) {
        accountsList.push(...dashboardAccountActions.map(account => account.actor));
      }
    } else if (
      paymentProcessor === Payment.PROCESSOR.FIO &&
      action === GenericAction.registerFioAddress &&
      !total
    ) {
      const dashboardAccountActions = await FioAccountProfile.getFreeItems();

      if (dashboardAccountActions && dashboardAccountActions.length > 0) {
        accountsList.push(...dashboardAccountActions.map(account => account.actor));
      }
    }
  }

  // If no specific txPublicKey was determined, use master public key as fallback
  if (!txPublicKey) {
    txPublicKey = fioApi.getMasterPublicKey();
  }

  // Get actor for the determined public key
  const actor = await fioApi.getActor(txPublicKey);
  if (actor) {
    accountsList.unshift(actor); // Add to front as primary account
  }

  // Remove duplicates and return
  return [...new Set(accountsList)];
};
