import { BlockchainTransaction, OrderItemStatus, Payment } from '../models/index.mjs';
import { FIO_CHAIN_ID } from '../config/constants.js';

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

export const normalizePriceForBitPayInTestNet = priceUsdc => {
  if (FIO_CHAIN_ID.TESTNET === process.env.FIO_CHAIN_ID) {
    return Math.max(1, priceUsdc);
  }
  return priceUsdc;
};
