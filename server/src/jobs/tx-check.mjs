import '../db';
import {
  OrderItemStatus,
  BlockchainTransaction,
  BlockchainTransactionEventLog,
} from '../models/index.mjs';
import CommonJob from './job.mjs';

import { updateOrderStatus } from '../services/updateOrderStatus.mjs';

import { fioApi } from '../external/fio.mjs';

import { FIO_ADDRESS_DELIMITER, FIO_ACTIONS } from '../config/constants.js';

import logger from '../logger.mjs';

const MAX_CHECK_TIMES = 10;

class TxCheckJob extends CommonJob {
  constructor() {
    super();
  }

  async execute() {
    await fioApi.getRawAbi();
    // get transactions need to check if exists
    const [items] = await BlockchainTransaction.checkIrreversibility();

    this.postMessage(`Process tx items - ${items.length}`);

    const processTxItem = item => async () => {
      if (this.isCancelled) return false;

      const {
        id,
        address,
        domain,
        action,
        params,
        btData = {},
        publicKey,
        btId,
        orderId,
      } = item;

      this.postMessage(`Processing tx item id - ${id}`);

      try {
        const walletSdk = fioApi.getPublicFioSDK();
        let status = BlockchainTransaction.STATUS.PENDING;

        switch (action) {
          case FIO_ACTIONS.registerFioAddress:
          case FIO_ACTIONS.registerFioDomain: {
            const { fio_addresses, fio_domains } = await walletSdk.getFioNames(
              (params && params.owner_fio_public_key) || publicKey,
            );
            const isAddress = action === FIO_ACTIONS.registerFioAddress;
            const fioName = isAddress
              ? `${address}${FIO_ADDRESS_DELIMITER}${domain}`
              : domain;

            let found;
            if (isAddress) {
              found = fio_addresses.find(({ fio_address }) => fio_address === fioName);
            } else {
              found = fio_domains.find(({ fio_domain }) => fio_domain === fioName);
            }

            if (found) status = BlockchainTransaction.STATUS.SUCCESS;

            if (!btData.checkIteration) btData.checkIteration = 0;
            ++btData.checkIteration;

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
          });
        } catch (error) {
          logger.error(`TX ITEM PROCESSING ERROR ${item.id} - SQL UPDATE`, error);
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
      } catch (e) {
        logger.error(`TX ITEM PROCESSING ERROR ${item.id}`, e);
      }

      return true;
    };

    const methods = Object.values(items).map(item => processTxItem(item));

    await this.executeActions(methods);

    this.finish();
  }
}

new TxCheckJob().execute();
