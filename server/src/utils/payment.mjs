import logger from '../logger.mjs';
import {
  BlockchainTransaction,
  OrderItemStatus,
  Payment,
  OrderItem,
} from '../models/index.mjs';
import MathOp from '../services/math.mjs';

/**
 * Calculate final FIO payment total from successful blockchain transactions
 * This replaces the prognosed/estimated price with actual blockchain-verified fees
 */
export const calculateActualFioPaymentTotal = async paymentId => {
  try {
    // Get all order item statuses for this payment
    const allOrderItemStatuses = await OrderItemStatus.findAll({
      where: { paymentId },
      include: [
        {
          model: BlockchainTransaction,
          required: false,
        },
        {
          model: OrderItem,
          required: true,
        },
      ],
    });

    // Get blockchain transaction IDs from successful order item statuses
    const successfulOrderItemStatuses = allOrderItemStatuses.filter(
      status =>
        status.txStatus === BlockchainTransaction.STATUS.SUCCESS &&
        status.blockchainTransactionId,
    );

    // Get the actual blockchain transactions for successful items
    const bcTxIds = successfulOrderItemStatuses.map(
      status => status.blockchainTransactionId,
    );
    const blockchainTransactions =
      bcTxIds.length > 0
        ? await BlockchainTransaction.findAll({
            where: {
              id: bcTxIds,
              status: BlockchainTransaction.STATUS.SUCCESS,
            },
          })
        : [];

    // Check if transactions are still pending - if so, return null to indicate "not ready yet"
    const pendingCount = allOrderItemStatuses.filter(
      status => status.txStatus === BlockchainTransaction.STATUS.PENDING,
    ).length;
    const readyCount = allOrderItemStatuses.filter(
      status => status.txStatus === BlockchainTransaction.STATUS.READY,
    ).length;
    if (pendingCount > 0 || readyCount > 0) {
      return null;
    }

    // Sum up all the actual fees collected from successful transactions (including free items)
    const actualTotal = blockchainTransactions.reduce((total, bcTx) => {
      const feeCollected = bcTx.feeCollected || '0';
      return new MathOp(total).add(feeCollected).toString();
    }, '0');

    // Count free vs paid items for clarity
    const freeItemsCount = successfulOrderItemStatuses.filter(status => {
      const orderItem = allOrderItemStatuses.find(ois => ois.id === status.id).OrderItem;
      return orderItem && parseFloat(orderItem.price || '0') === 0;
    }).length;
    const paidItemsCount = successfulOrderItemStatuses.length - freeItemsCount;

    logger.info(
      `ACTUAL_FIO_TOTAL_CALCULATED - PaymentID: ${paymentId}, TotalTxCount: ${blockchainTransactions.length}, PaidItems: ${paidItemsCount}, FreeItems: ${freeItemsCount}, ActualTotal: ${actualTotal}`,
    );

    return actualTotal;
  } catch (e) {
    logger.error(`ACTUAL_FIO_TOTAL_ERROR - PaymentID: ${paymentId}, Error: ${e.message}`);
    return null;
  }
};

/**
 * Update FIO payment with actual total from successful blockchain transactions
 * This includes fees from both paid and free items (free items are paid by other accounts)
 * This should be called after all transactions are completed
 */
export const updateFioPaymentWithActualTotal = async paymentId => {
  try {
    // Check if this is a FIO payment
    const payment = await Payment.findByPk(paymentId);
    if (!payment || payment.processor !== Payment.PROCESSOR.FIO) {
      logger.info(
        `SKIP_ACTUAL_TOTAL_UPDATE - PaymentID: ${paymentId}, Processor: ${payment.processor ||
          'NOT_FOUND'}`,
      );
      return;
    }

    // Calculate actual total from successful transactions
    const actualTotal = await calculateActualFioPaymentTotal(paymentId);

    if (actualTotal === null) {
      logger.info(
        `ACTUAL_TOTAL_NOT_READY_YET - PaymentID: ${paymentId} (transactions still pending/processing)`,
      );
      return;
    }

    // Compare with current payment price
    const currentPrice = payment.price || '0';
    if (currentPrice !== actualTotal) {
      logger.info(
        `UPDATING_PAYMENT_WITH_FINAL_PRICE - PaymentID: ${paymentId}, PrognosedPrice: ${currentPrice}, FinalActualPrice: ${actualTotal} (includes free items)`,
      );

      await Payment.update({ price: actualTotal }, { where: { id: paymentId } });

      logger.info(
        `PAYMENT_FINAL_PRICE_SET - PaymentID: ${paymentId}, FinalActualPrice: ${actualTotal} (blockchain-verified)`,
      );
    } else {
      logger.info(
        `PAYMENT_PROGNOSIS_WAS_ACCURATE - PaymentID: ${paymentId}, Price: ${actualTotal} (client estimate matched blockchain result)`,
      );
    }
  } catch (e) {
    logger.error(
      `UPDATE_ACTUAL_TOTAL_ERROR - PaymentID: ${paymentId}, Error: ${e.message}`,
    );
  }
};

/**
 * Sets prognosed/estimated FIO payment price from client-side fee calculation
 * This is temporary - the final accurate price will be set after blockchain execution
 */
export const prepareOrderWithFioPaymentForExecution = async ({
  paymentId,
  orderItems,
  fioNativePrice,
}) => {
  // Get current payment value before update
  try {
    const currentPayment = await Payment.findByPk(paymentId);
    if (currentPayment) {
      logger.info(
        `PAYMENT_CURRENT_VALUE - PaymentID: ${paymentId}, CurrentPrice: ${currentPayment.price}, CurrentStatus: ${currentPayment.status}`,
      );
    }
  } catch (e) {
    logger.error(`PAYMENT_READ_ERROR - PaymentID: ${paymentId}, Error: ${e.message}`);
  }

  const paymentUpdateParams = {
    status: Payment.STATUS.COMPLETED,
    currency: Payment.PROCESSOR.FIO,
  };
  if (fioNativePrice != null) paymentUpdateParams.price = fioNativePrice;

  try {
    await Payment.update(paymentUpdateParams, {
      where: { id: paymentId },
    });
    logger.info(
      `PAYMENT_PROGNOSED_PRICE_UPDATED - PaymentID: ${paymentId}, EstimatedPrice: ${fioNativePrice} (client estimate, not final)`,
    );
  } catch (e) {
    logger.error(`PAYMENT_UPDATE_ERROR - PaymentID: ${paymentId}, Error: ${e.message}`);
    throw e;
  }

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

  // Final verification - check if payment was modified by concurrent process
  try {
    const finalPayment = await Payment.findByPk(paymentId);
    if (finalPayment && finalPayment.price !== fioNativePrice) {
      const expectedPrice = parseFloat(fioNativePrice);
      const actualPrice = parseFloat(finalPayment.price);
      const difference = Math.abs(actualPrice - expectedPrice);
      logger.info(
        `PAYMENT_PROGNOSED_PRICE_CHANGED - PaymentID: ${paymentId}, Expected: ${fioNativePrice}, Actual: ${finalPayment.price}, Difference: ${difference} (price changed during processing)`,
      );
    } else {
      logger.info(
        `PAYMENT_PROGNOSED_PRICE_SET_SUCCESS - PaymentID: ${paymentId}, EstimatedPrice: ${finalPayment.price} (temporary estimate)`,
      );
    }
  } catch (e) {
    logger.error(
      `PAYMENT_VERIFICATION_ERROR - PaymentID: ${paymentId}, Error: ${e.message}`,
    );
  }
};

export const normalizePriceForBitPay = priceUsdc =>
  new MathOp(priceUsdc).gt(1) ? priceUsdc : '1';
