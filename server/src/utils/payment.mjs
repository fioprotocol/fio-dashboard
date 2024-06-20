import { BlockchainTransaction, OrderItemStatus, Payment } from '../models/index.mjs';

export const prepareOrderWithFioPaymentForExecution = async ({
  paymentId,
  orderItems,
  fioNativePrice,
}) => {
  await Payment.update(
    {
      status: Payment.STATUS.COMPLETED,
      price: fioNativePrice || null,
      currency: Payment.PROCESSOR.FIO,
    },
    {
      where: { id: paymentId },
    },
  );

  for (const orderItem of orderItems) {
    const bcTx = await BlockchainTransaction.create({
      action: orderItem.action,
      status: BlockchainTransaction.STATUS.READY,
      data: { params: orderItem.params },
      orderItemId: orderItem.id,
    });

    await OrderItemStatus.update(
      {
        paymentStatus: Payment.STATUS.COMPLETED,
        txStatus: BlockchainTransaction.STATUS.READY,
        blockchainTransactionId: bcTx.id,
      },
      {
        where: {
          orderItemId: orderItem.id,
          paymentId,
          txStatus: BlockchainTransaction.STATUS.NONE,
        },
      },
    );
  }
};
