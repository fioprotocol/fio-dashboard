import Sequelize from 'sequelize';

import '../db';
import { Notification, PublicWalletData, User, Wallet } from '../models/index.mjs';
import { sleep } from '../tools.mjs';
import CommonJob from './job.mjs';
import MathOp from '../services/math.mjs';

import { fioApi } from '../external/fio.mjs';
import { getROE } from '../external/roe.mjs';

import logger from '../logger.mjs';

import { DAY_MS, DOMAIN_EXP_PERIOD } from '../config/constants.js';

const CHUNKS_LIMIT = process.env.WALLET_DATA_JOB_CHUNKS_LIMIT || 1;
const CHUNKS_TIMEOUT = process.env.WALLET_DATA_JOB_CHUNKS_TIMEOUT || 1500;
const LOW_BUNDLES_THRESHOLD = 25;
const DAYS_30 = DAY_MS * 30;
const DOMAIN_EXP_TABLE = {
  5: null,
  4: DOMAIN_EXP_PERIOD.ABOUT_TO_EXPIRE,
  3: DOMAIN_EXP_PERIOD.EXPIRED_30,
  2: DOMAIN_EXP_PERIOD.EXPIRED_90,
  1: DOMAIN_EXP_PERIOD.EXPIRED_90,
  0: DOMAIN_EXP_PERIOD.EXPIRED,
};
const ITEMS_PER_FETCH = process.env.WALLET_DATA_JOB_ITEMS_PER_FETCH || 5;
const DEBUG_INFO = process.env.DEBUG_INFO_LOGS;

const returnDayRange = timePeriod => {
  if (timePeriod > DAYS_30) return DAYS_30 + 1;
  if (timePeriod < -DAYS_30 * 3) return -DAYS_30 * 3 - 1;

  return timePeriod;
};

class WalletDataJob extends CommonJob {
  constructor() {
    super();
  }

  logFioError(e, wallet, action = '-') {
    if (e && e.errorCode !== 404) {
      if (wallet && wallet.id)
        this.postMessage(
          `Process wallet error - id: ${wallet.id} - error - ${e.message} - action - ${action}`,
        );

      logger.error(e);
    }
  }

  async checkRequests(wallet) {
    const walletSdk = fioApi.getWalletSdkInstance(wallet.publicKey);
    const {
      publicWalletData: {
        requests: { sent, received },
        meta,
      },
    } = wallet;

    let sentRequests = [];
    let receivedRequests = [];
    let changed = false;

    try {
      try {
        const requestsResponse = await walletSdk.getSentFioRequests(0, 0, true);
        sentRequests = requestsResponse.requests;
      } catch (e) {
        sentRequests = [...sent];
        this.logFioError(e, wallet, 'getSentFioRequests');
      }

      if (sent.length && sent.length !== sentRequests.length) {
        changed = true;
      }

      if (!sent.length && sentRequests.length) {
        changed = true;
        sent.push(
          ...sentRequests.map(({ fio_request_id, status }) => ({
            fio_request_id,
            status,
          })),
        );
      }

      for (const request of sent) {
        const fetchedItem = sentRequests.find(
          fetchedRequest =>
            Number(fetchedRequest.fio_request_id) === Number(request.fio_request_id) &&
            fetchedRequest.status !== request.status,
        );
        if (fetchedItem) {
          changed = true;
          await Notification.create({
            type: Notification.TYPE.INFO,
            contentType:
              fetchedItem.status === 'rejected'
                ? Notification.CONTENT_TYPE.FIO_REQUEST_REJECTED
                : Notification.CONTENT_TYPE.FIO_REQUEST_APPROVED,
            userId: wallet.User.id,
            data: {
              pagesToShow: ['/'],
              emailData: {
                requestingFioCryptoHandle: fetchedItem.payee_fio_address,
                requestSentTo: fetchedItem.payer_fio_address,
                wallet: wallet.publicKey,
                fioRequestId: fetchedItem.fio_request_id,
                date: new Date(fetchedItem.time_stamp),
              },
            },
          });
        }
      }
    } catch (e) {
      this.logFioError(e, wallet, 'checkSentFioRequests');
    }

    try {
      const receivedRequestsOffset = received.length > 1 ? received.length - 1 : 0;

      try {
        const requestsResponse = await walletSdk.getReceivedFioRequests(
          0,
          receivedRequestsOffset,
          true,
        );
        receivedRequests = requestsResponse.requests;
      } catch (e) {
        receivedRequests = [...received];
        this.logFioError(e, wallet, 'getReceivedFioRequests');
      }

      if (!received.length && receivedRequests.length) {
        changed = true;
        meta.receivedRequestsOffset = receivedRequestsOffset;
        received.push(
          ...receivedRequests.map(({ fio_request_id, status }) => ({
            fio_request_id,
            status,
          })),
        );
      }

      if (received.length && receivedRequests.length) {
        changed = true;

        meta.receivedRequestsOffset = receivedRequestsOffset;

        for (const fetchedItem of receivedRequests) {
          const existed = received.find(
            request =>
              Number(fetchedItem.fio_request_id) === Number(request.fio_request_id),
          );
          if (!existed) {
            received.push({
              fio_request_id: fetchedItem.fio_request_id,
              status: fetchedItem.status,
            });

            if (fetchedItem.status === 'requested')
              await Notification.create({
                type: Notification.TYPE.INFO,
                contentType: Notification.CONTENT_TYPE.NEW_FIO_REQUEST,
                userId: wallet.User.id,
                data: {
                  pagesToShow: ['/'],
                  emailData: {
                    requestor: fetchedItem.payee_fio_address,
                    to: fetchedItem.payer_fio_address,
                    wallet: wallet.publicKey,
                    fioRequestId: fetchedItem.fio_request_id,
                    date: new Date(fetchedItem.time_stamp),
                  },
                },
              });
          }
        }
      }
    } catch (e) {
      this.logFioError(e, wallet, 'checkReceivedFioRequests');
    }

    if (changed) {
      await PublicWalletData.update(
        {
          requests: {
            sent: sentRequests.map(({ fio_request_id, status }) => ({
              fio_request_id,
              status,
            })),
            received,
          },
          meta,
        },
        { where: { id: wallet.publicWalletData.id } },
      );
    }
  }

  async checkFioNames(wallet) {
    try {
      const {
        publicWalletData: { cryptoHandles, domains },
      } = wallet;
      const { fio_addresses, fio_domains } = await fioApi
        .getPublicFioSDK()
        .getFioNames(wallet.publicKey);

      let changed = false;

      if (!cryptoHandles.length && fio_addresses.length) {
        changed = true;
        cryptoHandles.push(...fio_addresses);
      }

      if (!domains.length && fio_domains.length) {
        changed = true;
        domains.push(...fio_domains);
      }

      for (const cryptoHandle of cryptoHandles) {
        const fetched = fio_addresses.find(
          item => item.fio_address === cryptoHandle.fio_address,
        );
        if (fetched) {
          if (
            fetched.remaining_bundled_tx < LOW_BUNDLES_THRESHOLD &&
            cryptoHandle.remaining_bundled_tx >= LOW_BUNDLES_THRESHOLD
          ) {
            changed = true;
            await Notification.create({
              type: Notification.TYPE.INFO,
              contentType: Notification.CONTENT_TYPE.LOW_BUNDLE_TX,
              userId: wallet.User.id,
              data: {
                pagesToShow: ['/'],
                emailData: {
                  name: fetched.fio_address,
                  bundles: fetched.remaining_bundled_tx,
                },
              },
            });
          }
        } else {
          changed = true;
        }
      }

      for (const domain of domains) {
        const fetchedDomain = fio_domains.find(
          item => item.fio_domain === domain.fio_domain,
        );

        if (fetchedDomain && fetchedDomain.expiration !== domain.expiration) {
          changed = true;
          domain.expiration = fetchedDomain.expiration;
        }

        if (!fetchedDomain) {
          changed = true;
          continue;
        }

        const timePeriod = new Date(domain.expiration).getTime() - new Date().getTime();
        const domainExpPeriod =
          DOMAIN_EXP_TABLE[
            Math.floor((returnDayRange(timePeriod) + DAYS_30 * 4) / DAYS_30)
          ];

        if (domainExpPeriod) {
          const existingNotification = await Notification.findOneWhere({
            userId: wallet.User.id,
            data: {
              emailData: {
                name: domain.fio_domain,
                date: new Date(domain.expiration),
                domainExpPeriod,
              },
            },
          });
          if (!existingNotification)
            await Notification.create({
              type: Notification.TYPE.INFO,
              contentType: Notification.CONTENT_TYPE.DOMAIN_EXPIRE,
              userId: wallet.User.id,
              data: {
                pagesToShow: ['/'],
                emailData: {
                  name: domain.fio_domain,
                  date: new Date(domain.expiration),
                  domainExpPeriod,
                },
              },
            });
        }
      }

      if (changed) {
        await PublicWalletData.update(
          {
            cryptoHandles: fio_addresses,
            domains: fio_domains,
          },
          { where: { id: wallet.publicWalletData.id } },
        );
      }
    } catch (e) {
      this.logFioError(e, wallet, 'checkFioNames');
    }
  }

  async checkBalance(wallet) {
    try {
      let balance = 0;
      try {
        const balanceResponse = await fioApi
          .getPublicFioSDK()
          .getFioBalance(wallet.publicKey);
        balance = balanceResponse.balance;
      } catch (e) {
        this.logFioError(e, wallet);
        // other error (when 404 the balance is 0)
        if (e.errorCode !== 404) balance = wallet.publicWalletData.balance;
      }
      const { publicWalletData } = wallet;

      if (publicWalletData.balance === null) {
        publicWalletData.balance = balance;
        await PublicWalletData.update(
          { balance },
          { where: { id: publicWalletData.id } },
        );
      }

      if (!new MathOp(publicWalletData.balance).eq(balance)) {
        const roe = await getROE();
        const fioNativeChangeBalance = new MathOp(balance)
          .sub(publicWalletData.balance)
          .toNumber();
        const usdcChangeBalance = fioApi.convertFioToUsdc(
          new MathOp(fioNativeChangeBalance).abs().toNumber(),
          roe,
        );
        const usdcBalance = fioApi.convertFioToUsdc(balance, roe);
        const sign = new MathOp(fioNativeChangeBalance).gt(0) ? '+' : '-';

        await Notification.create({
          type: Notification.TYPE.INFO,
          contentType: Notification.CONTENT_TYPE.BALANCE_CHANGED,
          userId: wallet.User.id,
          data: {
            pagesToShow: ['/'],
            emailData: {
              fioBalanceChange: `${sign}${fioApi.sufToAmount(
                new MathOp(fioNativeChangeBalance).abs().toNumber(),
              )} FIO ($${usdcChangeBalance} USDC)`,
              newFioBalance: `${fioApi.sufToAmount(balance)} FIO ($${usdcBalance} USDC)`,
              wallet: wallet.publicKey,
              date: new Date(),
            },
          },
        });

        await PublicWalletData.update(
          { balance },
          { where: { id: publicWalletData.id } },
        );
      }
    } catch (e) {
      this.logFioError(e, wallet, 'checkBalance');
    }
  }

  async getWallets(offset = 0) {
    return Wallet.findAll({
      include: [
        {
          model: User,
          where: { status: { [Sequelize.Op.ne]: User.STATUS.BLOCKED } },
        },
        { model: PublicWalletData, as: 'publicWalletData' },
      ],
      offset,
      limit: ITEMS_PER_FETCH,
      raw: true,
      nest: true,
    });
  }

  async execute() {
    await fioApi.getRawAbi();
    let offset = 0;

    const processWallet = wallet => async () => {
      if (this.isCancelled) return false;

      if (DEBUG_INFO) this.postMessage(`Process wallet - ${wallet.id}`);

      if (!wallet.publicWalletData.id) {
        const newItem = await PublicWalletData.create({
          walletId: wallet.id,
          balance: null,
          requests: {
            sent: [],
            received: [],
          },
          obtData: [],
          cryptoHandles: [],
          domains: [],
          meta: { receivedRequestsOffset: 0 },
        });
        wallet.publicWalletData.id = newItem.id;
        wallet.publicWalletData.requests = newItem.requests;
        wallet.publicWalletData.cryptoHandles = newItem.cryptoHandles;
        wallet.publicWalletData.domains = newItem.domains;
        wallet.publicWalletData.meta = newItem.meta;
      }

      try {
        await Promise.allSettled([
          this.checkBalance(wallet),
          this.checkFioNames(wallet),
          this.checkRequests(wallet),
        ]);
      } catch (e) {
        logger.error(`WALLET PROCESSING ERROR`, e);
      }

      return true;
    };

    let wallets = await this.getWallets();
    while (wallets.length) {
      if (DEBUG_INFO) this.postMessage(`Process wallets - ${wallets.length} / ${offset}`);

      const methods = wallets.map(wallet => processWallet(wallet));

      let chunks = [];
      for (const method of methods) {
        chunks.push(method);
        if (chunks.length === CHUNKS_LIMIT) {
          if (DEBUG_INFO) this.postMessage(`Process chunk - ${chunks.length}`);
          await this.executeActions(chunks);
          await sleep(CHUNKS_TIMEOUT);
          chunks = [];
        }
      }

      if (chunks.length) {
        if (DEBUG_INFO) this.postMessage(`Process chunk - ${chunks.length}`);
        await this.executeActions(chunks);
      }

      offset += ITEMS_PER_FETCH;
      wallets = await this.getWallets(offset);
    }

    this.finish();
  }
}

new WalletDataJob().execute();
