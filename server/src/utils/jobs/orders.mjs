import {
  BlockchainTransaction,
  OrderItem,
  OrderItemStatus,
} from '../../models/index.mjs';

export const checkIfDomainOnOrderRegistered = async (orderItem, options) => {
  const { domain, orderId } = orderItem;
  const { action, errorMessage, onFail } = options;

  const domainOnOrder = await OrderItem.findOne({
    where: { action, domain, orderId },
    include: [{ model: OrderItemStatus }],
  });

  if (domainOnOrder) {
    const ordersDomain = OrderItem.format(domainOnOrder.get({ plain: true }));

    if (
      ordersDomain &&
      ordersDomain.orderItemStatus &&
      (ordersDomain.orderItemStatus.txStatus === BlockchainTransaction.STATUS.FAILED ||
        ordersDomain.orderItemStatus.txStatus === BlockchainTransaction.STATUS.CANCEL ||
        ordersDomain.orderItemStatus.txStatus === BlockchainTransaction.STATUS.EXPIRE)
    ) {
      if (onFail) {
        await onFail(errorMessage);
      }
      throw new Error(errorMessage);
    }
  }
};
