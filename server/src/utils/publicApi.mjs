import { FIO_ADDRESS_DELIMITER, PAYMENTS_STATUSES } from '../config/constants.js';
import { PUB_API_ERROR_CODES } from '../constants/pubApiErrorCodes.mjs';
import { HTTP_CODES } from '../constants/general.mjs';
import logger from '../logger.mjs';
import { BlockchainTransaction } from '../models/index.mjs';

export const execute = async (res, name, args, executor) => {
  logger.info(`Public Api (${name}) args: ${JSON.stringify(args)}`);
  try {
    const result = await executor(args);
    logger.info(`Public Api (${name}) result: ${JSON.stringify(result)}`);
    return result;
  } catch (e) {
    logger.error(`Public Api (${name}) error`, e);
    return generateErrorResponse(res, {
      error: `Server error. Please try later.`,
      errorCode: PUB_API_ERROR_CODES.SERVER_ERROR,
      statusCode: HTTP_CODES.INTERNAL_SERVER_ERROR,
    });
  }
};

const restoreKeyFromValue = (set, value) => {
  return Object.fromEntries(Object.entries(set).map(a => a.reverse()))[value];
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

export const formatChainDomain = domain => {
  if (!domain) {
    return;
  }
  const { id, name, domainhash, account, is_public, expiration } = domain;
  return {
    id,
    name,
    domainHash: domainhash,
    account,
    isPublic: is_public === 1,
    expiration,
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
