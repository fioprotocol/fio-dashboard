import {
  BlockchainTransaction,
  OrderItem,
  OrderItemStatus,
} from '../../models/index.mjs';

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
 * Generate unique expiration offset using hash-based approach
 * to keep offsets within reasonable blockchain limits (max 600 seconds = 10 minutes)
 * @param {number|string} orderItemId - The unique order item ID
 * @returns {number} Unique offset between 1 and 600 seconds
 */

export const generateUniqueExpirationOffset = orderItemId => {
  // Create a simple hash of the orderItemId
  const str = orderItemId.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Ensure positive number and limit to 600 seconds (10 minutes)
  // This gives us 600 unique possible offsets, which should be sufficient
  // for avoiding duplicate transactions while keeping within blockchain limits
  const maxOffsetSeconds = 600;
  return Math.abs(hash % maxOffsetSeconds) + 1; // +1 to avoid 0 offset
};
