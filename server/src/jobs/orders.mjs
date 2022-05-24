import { parentPort } from 'worker_threads';

import Sequelize from 'sequelize';

import '../db';
import { fioApi, INSUFFICIENT_FUNDS_ERR_MESSAGE } from '../external/fio.mjs';
import {
  OrderItem,
  FioAccountProfile,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  OrderItemStatus,
} from '../models/index.mjs';

import { FIO_ADDRESS_DELIMITER } from '../config/constants.js';

import { sendInsufficientFundsNotification } from '../services/fallback-funds-email.mjs';

import logger from '../logger.mjs';

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', message => {
    if (message === 'cancel') isCancelled = true;
  });

(async () => {
  // get order items ready to process
  const items = await OrderItem.getActionRequired();

  parentPort.postMessage(`Process order items - ${items.length}`);

  const defaultFioAccountProfile = await FioAccountProfile.getDefault();
  const processOrderItem = async item => {
    if (isCancelled) return false;

    const {
      id,
      address,
      domain,
      action,
      params,
      blockchainTransactionId,
      label,
      tpid,
      actor,
      permission,
    } = item;

    parentPort.postMessage(`Processing item id - ${id}`);

    try {
      const fioName = (address ? address + FIO_ADDRESS_DELIMITER : '') + domain;
      const auth = {
        actor: defaultFioAccountProfile.actor,
        permission: defaultFioAccountProfile.permission,
      };

      // Set auth from fio account profile for registerFioAddress action
      if (action === OrderItem.ACTION.registerFioAddress) {
        auth.actor = actor;
        auth.permission = permission;
      }
      params.tpid = tpid;

      try {
        const result = await fioApi.executeAction(action, params, auth);

        if (result.transaction_id) {
          parentPort.postMessage(
            `Processing item transactions created - ${id} / ${result.transaction_id}`,
          );
          await OrderItem.setPending(result, id, blockchainTransactionId);

          return;
        }

        // transaction failed
        const fieldError = Array.isArray(result.fields)
          ? result.fields.find(f => f.error)
          : null;

        const notes = fieldError ? fieldError.error : JSON.stringify(result);

        // try to execute using fallback account when no funds
        if (
          notes === INSUFFICIENT_FUNDS_ERR_MESSAGE &&
          actor !== process.env.REG_FALLBACK_ACCOUNT
        ) {
          await sendInsufficientFundsNotification(fioName, label, auth);
          return processOrderItem({
            ...item,
            actor: process.env.REG_FALLBACK_ACCOUNT,
            permission: process.env.REG_FALLBACK_PERMISSION,
          });
        }

        await Sequelize.sequelize.transaction(async t => {
          await BlockchainTransaction.update(
            {
              status: BlockchainTransaction.STATUS.REVIEW,
            },
            {
              where: {
                id: blockchainTransactionId,
                orderItemId: id,
                status: BlockchainTransaction.STATUS.READY,
              },
              transaction: t,
            },
          );

          await BlockchainTransactionEventLog.create(
            {
              status: BlockchainTransaction.STATUS.REVIEW,
              statusNotes: notes,
              blockchainTransactionId,
            },
            { transaction: t },
          );

          await OrderItemStatus.update(
            {
              status: BlockchainTransaction.STATUS.REVIEW,
            },
            {
              where: {
                orderItemId: id,
                blockchainTransactionId,
                status: BlockchainTransaction.STATUS.READY,
              },
              transaction: t,
            },
          );
        });
      } catch (error) {
        logger.error(`ORDER ITEM PROCESSING ERROR ${item.id}`, error);
      }
    } catch (e) {
      logger.error(`ORDER ITEM PROCESSING ERROR ${item.id}`, e);
    }

    return true;
  };

  const methods = Object.values(items).map(item => processOrderItem(item));

  await Promise.allSettled(methods);

  process.exit(0);
})();
