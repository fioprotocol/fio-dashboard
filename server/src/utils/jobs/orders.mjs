import {
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  OrderItem,
  OrderItemStatus,
  Var,
} from '../../models/index.mjs';
import { VARS_KEYS } from '../../config/constants.js';
import logger from '../../logger.mjs';

export const checkIfOrderedDomainRegisteredInBlockchain = async (
  domainOnOrder,
  options,
) => {
  const { errorMessage, onFail, fioApi } = options;

  const orderedDomain = OrderItem.format(domainOnOrder.get({ plain: true }));

  // First check if the database shows the transaction failed
  if (
    orderedDomain &&
    orderedDomain.orderItemStatus &&
    (orderedDomain.orderItemStatus.txStatus === BlockchainTransaction.STATUS.FAILED ||
      orderedDomain.orderItemStatus.txStatus === BlockchainTransaction.STATUS.CANCEL ||
      orderedDomain.orderItemStatus.txStatus === BlockchainTransaction.STATUS.EXPIRE)
  ) {
    if (onFail) {
      await onFail(errorMessage);
    }
    throw new Error(errorMessage);
  }

  // Check if domain registration is successfully completed in database
  const isSuccessInDb =
    orderedDomain &&
    orderedDomain.orderItemStatus &&
    orderedDomain.orderItemStatus.txStatus === BlockchainTransaction.STATUS.SUCCESS;

  // If already successful in database, return true
  if (isSuccessInDb) {
    return true;
  }

  // If not yet marked as successful in database, check actual blockchain state
  if (fioApi) {
    try {
      const domainOnBlockchain = await fioApi.getFioDomain(domainOnOrder.domain);
      // If domain exists on blockchain, it's registered successfully
      return !!domainOnBlockchain;
    } catch (error) {
      // If there's an error checking blockchain, fall back to database status
      return false;
    }
  }

  // Fallback to database status
  return isSuccessInDb;
};

export const getDomainOnOrder = (orderItem, action) => {
  const { domain, orderId } = orderItem;
  return OrderItem.findOne({
    where: { action, domain, orderId },
    include: [{ model: OrderItemStatus }],
  });
};

/**
 * Unique expiration offset generator (persistent, monotonic).
 * Ensures the absolute expiration (now + default + additional) strictly
 * increases across calls, even after process restarts, by persisting the
 * last normalized value in the DB (`vars` table).
 */

// Tracks the last normalized expiration we returned (nowSec + offset)
// Ensures strictly increasing expirations across rapid successive calls.
let lastNormalizedExpirationSec = 0;

/**
 * Generate a unique additional expiration offset (in seconds) to avoid
 * duplicate transactions when other parameters are identical.
 *
 * Rationale:
 * - FIO SDK builds expiration as: now + defaultOffset (+ this additional offset)
 * - If multiple transactions are created close together, their expirations can collide.
 * - We keep a module-level, monotonically increasing "now + offset" target so that
 *   each call produces a strictly later expiration than any previous one.
 *
 * Notes:
 * - We don't cap the offset artificially; if many calls happen within the same second,
 *   the offset temporarily grows to preserve uniqueness and naturally shrinks as time passes.
 * - The argument is accepted for signature compatibility but not required for uniqueness.
 *
 * @returns {number} additional offset in seconds (>= 1)
 */
export const generateUniqueExpirationOffset = async () => {
  const nowSec = Math.floor(Date.now() / 1000);
  const minAdditionalOffset = 1;

  // We coordinate across processes using the vars table to keep a
  // monotonically increasing normalized expiration (now + offset).
  const desired = await Var.sequelize.transaction(async t => {
    // Lock latest row for this key (in case of duplicates, use the newest one)
    const rows = await Var.sequelize.query(
      'SELECT id, value FROM vars WHERE "key" = :k ORDER BY id DESC LIMIT 1 FOR UPDATE',
      {
        replacements: { k: VARS_KEYS.FIO_LAST_NORM_EXP_SEC },
        type: Var.sequelize.QueryTypes.SELECT,
        transaction: t,
      },
    );

    const minNormalized = Math.max(
      nowSec + minAdditionalOffset,
      lastNormalizedExpirationSec + 1,
    );

    if (!rows || rows.length === 0) {
      const candidate = minNormalized;
      await Var.sequelize.query(
        'INSERT INTO vars("key", value, "createdAt", "updatedAt") VALUES (:k, :val, now(), now())',
        {
          replacements: { k: VARS_KEYS.FIO_LAST_NORM_EXP_SEC, val: String(candidate) },
          type: Var.sequelize.QueryTypes.INSERT,
          transaction: t,
        },
      );
      return candidate;
    }

    const row = rows[0];
    const persisted = Number.parseInt(row.value, 10) || 0;
    const candidate = Math.max(minNormalized, persisted + 1);

    await Var.sequelize.query(
      'UPDATE vars SET value = :val, "updatedAt" = now() WHERE id = :id',
      {
        replacements: { id: row.id, val: String(candidate) },
        type: Var.sequelize.QueryTypes.UPDATE,
        transaction: t,
      },
    );
    return candidate;
  });

  lastNormalizedExpirationSec = desired;
  return desired - nowSec;
};

// Detects FIO duplicate transaction error shape
export const isDuplicateTxError = result => {
  try {
    if (!result || typeof result !== 'object') return false;
    const err = result.error || {};
    const isConflict = result.code === 409 && result.message === 'Conflict';
    const isTxDuplicate = err && (err.name === 'tx_duplicate' || err.code === 3040008);
    const detailsDuplicate = Array.isArray(err.details)
      ? err.details.some(
          d =>
            d &&
            typeof d.message === 'string' &&
            d.message.toLowerCase().includes('duplicate transaction'),
        )
      : false;
    return Boolean(
      isTxDuplicate ||
        (isConflict && (isTxDuplicate || detailsDuplicate)) ||
        detailsDuplicate,
    );
  } catch (_) {
    return false;
  }
};

// Reschedule item by ensuring statuses remain READY for next chunk and increment retry counter
export const rescheduleItemReady = async (
  orderItem,
  statusNotes = 'Duplicate transaction. Rescheduled for next chunk.',
) => {
  try {
    const { id: orderItemId, blockchainTransactionId } = orderItem;
    await BlockchainTransaction.sequelize.transaction(async t => {
      // Lock bc tx and increment duplicateRetries in data
      const bcTx = await BlockchainTransaction.findOne({
        where: { id: blockchainTransactionId, orderItemId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const prevData = (bcTx && bcTx.data) || {};
      const retries = Number(prevData.duplicateRetries || 0) + 1;
      const newData = { ...prevData, duplicateRetries: retries };

      await BlockchainTransaction.update(
        { status: BlockchainTransaction.STATUS.READY, data: newData },
        {
          where: { id: blockchainTransactionId, orderItemId },
          transaction: t,
        },
      );
      await OrderItemStatus.update(
        { txStatus: BlockchainTransaction.STATUS.READY },
        {
          where: { orderItemId, blockchainTransactionId },
          transaction: t,
        },
      );

      await BlockchainTransactionEventLog.create(
        {
          status: BlockchainTransaction.STATUS.READY,
          statusNotes,
          blockchainTransactionId,
        },
        { transaction: t },
      );
    });
  } catch (e) {
    logger.error('Reschedule item to READY failed', e);
  }
};

export const getDuplicateRetryCount = async blockchainTransactionId => {
  try {
    const bcTx = await BlockchainTransaction.findOne({
      where: { id: blockchainTransactionId },
      attributes: ['id', 'data'],
    });
    const count = (bcTx && bcTx.data && bcTx.data.duplicateRetries) || 0;
    return Number(count) || 0;
  } catch (e) {
    logger.error('Get duplicate retry count failed', e);
    return 0;
  }
};
