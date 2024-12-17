import '../db';
import { GenericAction } from '@fioprotocol/fiosdk';

import {
  OrderItemStatus,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  LockedFch,
  OrderItem,
  FioApiUrl,
  Var,
} from '../models/index.mjs';
import CommonJob from './job.mjs';

import { updateOrderStatus } from '../services/updateOrderStatus.mjs';

import { fioApi } from '../external/fio.mjs';
import FioHistory from '../external/fio-history.mjs';

import { FIO_ADDRESS_DELIMITER, ERROR_CODES, VARS_KEYS } from '../config/constants.js';
import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';

import logger from '../logger.mjs';

const MAX_CHECK_TIMES = 10;

class TxCheckJob extends CommonJob {
  async execute() {
    await fioApi.getRawAbi();

    const walletSdk = await fioApi.getPublicFioSDK();
    // get transactions need to check if exists
    const [items] = await BlockchainTransaction.checkIrreversibility();

    const bcTxOrderItems = items.reduce((acc, item) => {
      if (!acc[item.orderId]) acc[item.orderId] = [];
      acc[item.orderId].push(item);

      return acc;
    }, {});

    const fioHistoryUrls = await FioApiUrl.getApiUrls({
      type: FIO_API_URLS_TYPES.DASHBOARD_HISTORY_URL,
    });

    const maxRetries = Number(await Var.getValByKey(VARS_KEYS.DEFAULT_MAX_RETRIES));

    const processTxItems = items => async () => {
      if (this.isCancelled) return false;

      const { orderId } = items[0];

      for (const item of items) {
        const {
          id,
          address,
          domain,
          action,
          btData = {},
          btId,
          params,
          publicKey,
          txId,
        } = item;
        this.postMessage(`Processing tx item id - ${id}`);

        try {
          let status = BlockchainTransaction.STATUS.PENDING;

          switch (action) {
            case GenericAction.renewFioDomain:
            case GenericAction.addBundledTransactions:
              status = BlockchainTransaction.STATUS.SUCCESS;
              break;
            case GenericAction.registerFioDomainAddress:
            case GenericAction.registerFioAddress:
            case GenericAction.registerFioDomain: {
              const { fio_addresses, fio_domains } = await walletSdk.getFioNames(
                (params && params.owner_fio_public_key) || publicKey,
              );
              const isAddress =
                action === GenericAction.registerFioAddress ||
                action === GenericAction.registerFioDomainAddress;
              const fioName = isAddress
                ? `${address}${FIO_ADDRESS_DELIMITER}${domain}`
                : domain;

              let found;
              if (isAddress) {
                found = fio_addresses.find(
                  ({ fio_address }) =>
                    fio_address.toLowerCase() === fioName.toLowerCase(),
                );
              } else {
                found = fio_domains.find(
                  ({ fio_domain }) => fio_domain.toLowerCase() === fioName.toLowerCase(),
                );
              }

              if (found) status = BlockchainTransaction.STATUS.SUCCESS;

              if (!btData.checkIteration) btData.checkIteration = 0;
              ++btData.checkIteration;

              if (!found && status !== BlockchainTransaction.STATUS.SUCCESS) {
                try {
                  const resJson = await new FioHistory({
                    fioHistoryUrls,
                  }).getTransaction({ transactionId: txId, maxRetries });
                  const res = JSON.parse(resJson);
                  const txRegexpString = `Transaction ${txId} not found`;
                  const txRegexp = new RegExp(txRegexpString, 'i');

                  if (
                    res.code &&
                    res.code === ERROR_CODES.RANGE_NOT_SATISFIABLE &&
                    res.error &&
                    res.error.details &&
                    res.error.details.find(details => !!details.message.match(txRegexp))
                  ) {
                    status = BlockchainTransaction.STATUS.EXPIRE;
                  }
                } catch (error) {
                  logger.error(
                    `TX ITEM GET HISTORY ERROR ${item.id} - txId: ${txId}`,
                    error,
                  );
                }
              }

              if (
                btData.checkIteration > MAX_CHECK_TIMES &&
                status !== BlockchainTransaction.STATUS.SUCCESS
              )
                status = BlockchainTransaction.STATUS.EXPIRE;

              break;
            }
            default:
            //
          }

          try {
            await BlockchainTransaction.sequelize.transaction(async t => {
              await BlockchainTransaction.update(
                {
                  status,
                  data: btData,
                },
                {
                  where: {
                    id: btId,
                    orderItemId: id,
                    status: BlockchainTransaction.STATUS.PENDING,
                  },
                  transaction: t,
                },
              );

              await BlockchainTransactionEventLog.create(
                {
                  status,
                  blockchainTransactionId: btId,
                },
                { transaction: t },
              );

              await OrderItemStatus.update(
                {
                  txStatus: status,
                },
                {
                  where: {
                    orderItemId: id,
                    blockchainTransactionId: btId,
                    txStatus: BlockchainTransaction.STATUS.PENDING,
                  },
                  transaction: t,
                },
              );
              if (status === BlockchainTransaction.STATUS.SUCCESS) {
                const { address, domain } =
                  (await OrderItem.findOne({ where: { id } })) || {};

                if (address && domain)
                  await LockedFch.deleteLockedFch({
                    fch: fioApi.setFioName(address, domain),
                  });
              }
            });
          } catch (error) {
            logger.error(`TX ITEM PROCESSING ERROR ${item.id} - SQL UPDATE`, error);
          }
        } catch (e) {
          logger.error(`TX ITEM PROCESSING ERROR ${item.id}`, e);
        }
      }

      // Update Order status
      try {
        const items = await OrderItemStatus.getAllItemsStatuses(orderId);
        await updateOrderStatus(
          orderId,
          null,
          items.map(({ txStatus }) => txStatus),
        );
      } catch (error) {
        logger.error(
          `TX ITEM PROCESSING ERROR - ORDER STATUS UPDATE - ${orderId}`,
          error,
        );
      }

      return true;
    };

    const methods = Object.values(bcTxOrderItems).map(items => processTxItems(items));

    await this.executeActions(methods);

    this.finish();
  }
}

new TxCheckJob().execute();
