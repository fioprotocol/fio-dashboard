import {
  BlockchainTransaction,
  OrderItem,
  OrderItemStatus,
} from '../../models/index.mjs';

export const checkIfOrderedDomainRegisteredInBlockchain = async (
  domainOnOrder,
  options,
) => {
  const { errorMessage, onFail } = options;

  const orderedDomain = OrderItem.format(domainOnOrder.get({ plain: true }));

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
};

export const getDomainOnOrder = (orderItem, action) => {
  const { domain, orderId } = orderItem;
  return OrderItem.findOne({
    where: { action, domain, orderId },
    include: [{ model: OrderItemStatus }],
  });
};
