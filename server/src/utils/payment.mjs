import { BlockchainTransaction, OrderItemStatus, Payment } from '../models/index.mjs';
import MathOp from '../services/math.mjs';
import { FIO_CHAIN_ID } from '../config/constants.js';

export const prepareOrderWithFioPaymentForExecution = async ({
  paymentId,
  orderItems,
  fioNativePrice,
}) => {
  const paymentUpdateParams = {
    status: Payment.STATUS.COMPLETED,
    currency: Payment.PROCESSOR.FIO,
  };
  if (fioNativePrice != null) paymentUpdateParams.price = fioNativePrice;
  await Payment.update(paymentUpdateParams, {
    where: { id: paymentId },
  });

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
    return new MathOp(priceUsdc).gt(1) ? priceUsdc : '1';
  }
  return priceUsdc;
};
