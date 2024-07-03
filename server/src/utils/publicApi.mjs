import Sequelize from 'sequelize';

import {
  FIO_ADDRESS_DELIMITER,
  PAYMENTS_STATUSES,
  VARS_KEYS,
} from '../config/constants.js';
import { BlockchainTransaction, Var } from '../models/index.mjs';

const restoreKeyFromValue = (set, value) => {
  return Object.fromEntries(Object.entries(set).map(a => a.reverse()))[value];
};

const wait = ms => new Promise(res => setTimeout(res, ms));

export const createCallWithRetry = (maxDepth, timeout) => {
  const callWithRetry = async (fn, depth = 0) => {
    try {
      return await fn();
    } catch (e) {
      if (depth > maxDepth) {
        throw e;
      }
      await wait(2 ** depth * timeout);

      return callWithRetry(fn, depth + 1);
    }
  };

  return callWithRetry;
};

export const generateSummaryResponse = (data = []) => {
  return data.map(item => {
    const {
      address,
      domain,
      Order: { publicKey, Payments: [payment = {}] = [] } = {},
      BlockchainTransactions: [blockchainTransaction = {}] = [],
    } = item;
    const { PaymentEventLogs: [paymentEventLog = {}] = [] } = payment;
    const {
      BlockchainTransactionEventLogs: [blockchainTransactionEventLog = {}] = [],
    } = blockchainTransaction;

    return {
      owner_key: publicKey,
      address,
      domain,
      trx_id: blockchainTransaction.txId,
      trx_type: blockchainTransaction.action,
      trx_status: restoreKeyFromValue(
        BlockchainTransaction.STATUS,
        blockchainTransaction.status,
      ),
      trx_status_notes: blockchainTransactionEventLog.statusNotes,
      block_num: blockchainTransaction.blockNum,
      expiration: blockchainTransaction.expiration,
      forward_url: payment.externalPaymentUrl,
      buy_price: payment.price,
      pay_source: payment.processor,
      pay_metadata: payment.data,
      pay_status: restoreKeyFromValue(PAYMENTS_STATUSES, payment.status),
      pay_status_notes: paymentEventLog.statusNotes,
      extern_id: payment.externalId,
      extern_time: paymentEventLog.updatedAt,
      extern_status: restoreKeyFromValue(PAYMENTS_STATUSES, payment.status),
    };
  });
};

export const generateErrorResponse = (res, { error, errorCode, statusCode }) => {
  res.status(statusCode);
  return { error, errorCode, success: false };
};

export const generateSuccessResponse = (res, { accountId, charge }) => ({
  error: false,
  account_id: accountId,
  success: charge ? { charge } : true,
});

export const findDomainInRefProfile = (refProfile, fioDomain) => {
  const refDomains =
    refProfile.settings &&
    refProfile.settings.domains &&
    Array.isArray(refProfile.settings.domains)
      ? refProfile.settings.domains
      : [];
  return refDomains.find(({ name }) => name === fioDomain);
};

export const formatChainDomain = domain => {
  if (!domain) {
    return;
  }
  return {
    id: domain.id,
    name: domain.name,
    domainHash: domain.domainhash,
    account: domain.account,
    isPublic: domain.is_public === 1,
    expiration: domain.expiration,
  };
};

export const formatChainAddress = address => {
  if (!address) {
    return;
  }
  return {
    id: address.id,
    name: address.name,
    nameHash: address.namehash,
    domain: address.domain,
    domainHash: address.domainhash,
    expiration: address.expiration,
    ownerAccount: address.owner_account,
    bundleEligibleCountdown: address.bundleeligiblecountdown,
    addresses: address.addresses.map(it => ({
      tokenCode: it.token_code,
      chainCode: it.chain_code,
      publicAddress: it.public_address,
    })),
  };
};

export const destructAddress = address => {
  let fioAddress = null;
  let fioDomain;

  if (address.includes(FIO_ADDRESS_DELIMITER)) {
    const [handle, domain] = address.split(FIO_ADDRESS_DELIMITER);
    fioAddress = handle;
    fioDomain = domain;
  } else {
    fioDomain = address;
  }

  const type = fioAddress ? 'account' : 'domain';

  return { type, fioAddress, fioDomain };
};

export const whereLastRow = (tableName, parentTableName, joinColumn) => ({
  id: {
    [Sequelize.Op.eq]: Sequelize.literal(
      `(select max(id) from "${tableName}" where "${joinColumn}" = "${parentTableName}"."id")`,
    ),
  },
});

export const whereNotOf = (key, variants) => ({
  [key]: {
    [Sequelize.Op.notIn]: variants,
  },
});

export const isPublicApiAvailable = async () => {
  const varsData = await Var.getByKey(VARS_KEYS.IS_PUBLIC_API_AVAILABLE);
  return varsData.dataValues.value !== 'false';
};
