import Sequelize from 'sequelize';

import '../db';

import {
  DomainsWatchlist,
  Notification,
  PublicWalletData,
  User,
  Var,
  Wallet,
} from '../models/index.mjs';
import { sleep } from '../tools.mjs';
import CommonJob from './job.mjs';
import MathOp from '../services/math.mjs';
import { convertToNewDate } from '../utils/general.mjs';

import { fioApi } from '../external/fio.mjs';
import { getROE } from '../external/roe.mjs';

import logger from '../logger.mjs';

import {
  HOUR_MS,
  DAY_MS,
  DOMAIN_EXP_PERIOD,
  ERROR_CODES,
  VARS_KEYS,
} from '../config/constants.js';
import { DOMAIN_EXP_DEBUG_AFFIX } from '../constants/fio.mjs';

const { Op } = Sequelize;

const CHUNKS_LIMIT = parseInt(process.env.WALLET_DATA_JOB_CHUNKS_LIMIT) || 1;
const CHUNKS_TIMEOUT = parseInt(process.env.WALLET_DATA_JOB_CHUNKS_TIMEOUT) || 1500;
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
const ITEMS_PER_FETCH = parseInt(process.env.WALLET_DATA_JOB_ITEMS_PER_FETCH) || 5;
const DEBUG_INFO = process.env.DEBUG_INFO_LOGS;

const DOMAIN_EXP_DEBUG_TABLE = {
  expsoon: DOMAIN_EXP_PERIOD.ABOUT_TO_EXPIRE,
  exp30: DOMAIN_EXP_PERIOD.EXPIRED_30,
  exp90: DOMAIN_EXP_PERIOD.EXPIRED_90,
  exp90plus: DOMAIN_EXP_PERIOD.EXPIRED,
};
const LOW_BUNDLE_COUNT_DEBUG_AFFIX = 'testlowbundlecount';
const FIO_REQUEST_STATUSES = {
  REJECTED: 'rejected',
  PAID: 'sent_to_blockchain',
  PENDING: 'requested',
  CANCELED: 'cancelled',
};

const returnDayRange = timePeriod => {
  if (timePeriod > DAYS_30) return DAYS_30 + 1;
  if (timePeriod < -DAYS_30 * 3) return -DAYS_30 * 3 - 1;

  return timePeriod;
};

class WalletDataJob extends CommonJob {
  logFioError(e, wallet, action = '-') {
    if (e && e.errorCode !== ERROR_CODES.NOT_FOUND && e.code !== ERROR_CODES.NOT_FOUND) {
      if (wallet && wallet.id)
        this.postMessage(
          `Process wallet error - id: ${wallet.id} - error - ${e.message} - action - ${action}`,
        );

      logger.error(e);
    }
  }

  async createSentFioRequestNotification({ sentRequestItem, wallet }) {
    await Notification.create({
      type: Notification.TYPE.INFO,
      contentType:
        sentRequestItem.status === FIO_REQUEST_STATUSES.REJECTED
          ? Notification.CONTENT_TYPE.FIO_REQUEST_REJECTED
          : Notification.CONTENT_TYPE.FIO_REQUEST_APPROVED,
      userId: wallet.User.id,
      data: {
        pagesToShow: ['/'],
        emailData: {
          requestingFioCryptoHandle: sentRequestItem.payee_fio_address,
          requestSentTo: sentRequestItem.payer_fio_address,
          wallet: wallet.publicKey,
          fioRequestId: sentRequestItem.fio_request_id,
          date: await User.formatDateWithTimeZone(
            wallet.User.id,
            sentRequestItem.time_stamp,
          ),
        },
      },
    });
  }

  async checkRequests(wallet) {
    const walletSdk = await fioApi.getWalletSdkInstance(wallet.publicKey);
    const {
      publicWalletData: {
        requests: { sent, received },
        meta,
        createdAt,
      },
    } = wallet;

    const voteFioHandleVar = await Var.getByKey(VARS_KEYS.VOTE_FIO_HANDLE);

    const voteFioHandle = voteFioHandleVar ? voteFioHandleVar.value : null;

    let sentRequests = [];
    let receivedRequests = [];
    let changed = false;

    let publicWalletDataDate = null;

    if (createdAt) {
      publicWalletDataDate = new Date(createdAt);
    }

    try {
      const sentRequestsOffset = sent.length > 1 ? sent.length - 1 : 0;
      try {
        const requestsResponse = await walletSdk.getSentFioRequests({
          limit: 0,
          offset: sentRequestsOffset,
          includeEncrypted: true,
        });

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
      }

      for (const request of sent) {
        const fetchedItem = sentRequests.find(
          fetchedRequest =>
            Number(fetchedRequest.fio_request_id) === Number(request.fio_request_id) &&
            fetchedRequest.status !== request.status,
        );

        if (fetchedItem && wallet.User.emailNotificationParams.fioRequest) {
          changed = true;
          await this.createSentFioRequestNotification({
            sentRequestItem: fetchedItem,
            wallet,
          });
        }
      }

      const newRequests = sentRequests.filter(
        sentRequest =>
          !sent.some(
            sentItem =>
              Number(sentItem.fio_request_id) === Number(sentRequest.fio_request_id),
          ) &&
          (sentRequest.status === FIO_REQUEST_STATUSES.REJECTED ||
            sentRequest.status === FIO_REQUEST_STATUSES.PAID) &&
          sentRequest.payer_fio_address !== voteFioHandle,
      );

      for (const newRequest of newRequests) {
        const existingNotification = await Notification.findOneWhere({
          contentType: {
            [Op.or]: [
              Notification.CONTENT_TYPE.FIO_REQUEST_REJECTED,
              Notification.CONTENT_TYPE.FIO_REQUEST_APPROVED,
            ],
          },
          userId: wallet.User.id,
          data: {
            emailData: {
              requestingFioCryptoHandle: newRequest.payee_fio_address,
              requestSentTo: newRequest.payer_fio_address,
              wallet: wallet.publicKey,
              fioRequestId: newRequest.fio_request_id,
              date: await User.formatDateWithTimeZone(
                wallet.User.id,
                newRequest.time_stamp,
              ),
            },
          },
        });

        const sentFioRequestDate = new Date(newRequest.time_stamp);

        const fioRequestOlderThanPublicDataWalletCreated =
          publicWalletDataDate && publicWalletDataDate > sentFioRequestDate;

        if (
          !existingNotification &&
          wallet.User.emailNotificationParams.fioRequest &&
          !fioRequestOlderThanPublicDataWalletCreated &&
          newRequest.payer_fio_address !== voteFioHandle
        ) {
          changed = true;
          await this.createSentFioRequestNotification({
            sentRequestItem: newRequest,
            wallet,
          });
        }
      }
    } catch (e) {
      this.logFioError(e, wallet, 'checkSentFioRequests');
    }

    try {
      const receivedRequestsOffset = received.length > 1 ? received.length - 1 : 0;

      try {
        const requestsResponse = await walletSdk.getReceivedFioRequests({
          limit: 0,
          offset: receivedRequestsOffset,
          includeEncrypted: true,
        });
        receivedRequests = requestsResponse.requests;
      } catch (e) {
        receivedRequests = [...received];
        this.logFioError(e, wallet, 'getReceivedFioRequests');
      }

      if (receivedRequests.length) {
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

            const receivedFioRequestDate = new Date(fetchedItem.time_stamp);

            const fioRequestOlderThanPublicDataWalletCreated =
              publicWalletDataDate && publicWalletDataDate > receivedFioRequestDate;

            if (
              fetchedItem.status === FIO_REQUEST_STATUSES.PENDING &&
              wallet.User.emailNotificationParams.fioRequest &&
              !fioRequestOlderThanPublicDataWalletCreated
            )
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
                    date: await User.formatDateWithTimeZone(
                      wallet.User.id,
                      fetchedItem.time_stamp,
                    ),
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
            sent: sentRequests.map(
              ({ fio_request_id, status, time_stamp, payer_fio_address }) => ({
                fio_request_id,
                status,
                time_stamp,
                payer_fio_address,
              }),
            ),
            received,
          },
          meta,
        },
        { where: { id: wallet.publicWalletData.id } },
      );
    }
  }

  async handleDomainExpiration({
    domainExpiration,
    domainName,
    userId,
    enableSendDomainExpireEmails,
  }) {
    const timePeriod =
      convertToNewDate(domainExpiration).getTime() - new Date().getTime();
    let domainExpPeriod =
      DOMAIN_EXP_TABLE[Math.floor((returnDayRange(timePeriod) + DAYS_30 * 4) / DAYS_30)];

    if (
      process.env.EMAILS_JOB_SIMULATION_EXPIRING_DOMAIN_ENABLED === 'true' &&
      domainName.includes(DOMAIN_EXP_DEBUG_AFFIX)
    ) {
      Object.keys(DOMAIN_EXP_DEBUG_TABLE).forEach(key => {
        if (domainName.includes(key)) {
          domainExpPeriod = DOMAIN_EXP_DEBUG_TABLE[key];
        }
      });
    }

    if (domainExpPeriod) {
      const existingNotification = await Notification.findOneWhere({
        contentType: Notification.CONTENT_TYPE.DOMAIN_EXPIRE,
        userId,
        data: {
          emailData: {
            name: domainName,
            date: await User.formatDateWithTimeZone(userId, domainExpiration),
            domainExpPeriod,
          },
        },
      });
      if (!existingNotification && enableSendDomainExpireEmails)
        await Notification.create({
          type: Notification.TYPE.INFO,
          contentType: Notification.CONTENT_TYPE.DOMAIN_EXPIRE,
          userId,
          data: {
            pagesToShow: ['/'],
            emailData: {
              name: domainName,
              date: await User.formatDateWithTimeZone(userId, domainExpiration),
              domainExpPeriod,
            },
          },
        });
    }
  }

  async checkDomainsWatchlist(domainsWatchlistItem) {
    const { domain, userId } = domainsWatchlistItem;

    if (domain) {
      const domainFromChain = await fioApi.getFioDomain(domain);

      if (domainFromChain) {
        const { expiration } = domainFromChain;

        this.handleDomainExpiration({
          domainExpiration: expiration,
          domainName: domain,
          userId,
          enableSendDomainExpireEmails:
            domainsWatchlistItem.User.emailNotificationParams.fioDomainExpiration,
        });
      }
    }
  }

  async checkFioNames(wallet) {
    try {
      const {
        publicWalletData: { cryptoHandles, domains },
      } = wallet;
      const publicFioSDK = await fioApi.getPublicFioSDK();
      const { fio_addresses, fio_domains } = await publicFioSDK.getFioNames(
        wallet.publicKey,
      );

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
            cryptoHandle.remaining_bundled_tx >= LOW_BUNDLES_THRESHOLD &&
            wallet.User.emailNotificationParams.lowBundles
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
          if (
            process.env.EMAILS_JOB_SIMULATION_LOW_BUNDLE_COUNT_ENABLED === 'true' &&
            fetched.fio_address.includes(LOW_BUNDLE_COUNT_DEBUG_AFFIX)
          ) {
            const existingNotification = await Notification.findOneWhere({
              contentType: Notification.CONTENT_TYPE.LOW_BUNDLE_TX,
              userId: wallet.User.id,
              data: {
                emailData: {
                  name: fetched.fio_address,
                },
              },
            });
            if (!existingNotification && wallet.User.emailNotificationParams.lowBundles) {
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

        this.handleDomainExpiration({
          domainExpiration: domain.expiration,
          domainName: domain.fio_domain,
          userId: wallet.User.id,
          enableSendDomainExpireEmails:
            wallet.User.emailNotificationParams.fioDomainExpiration,
        });
      }

      if (
        (cryptoHandles.length &&
          fio_addresses.length &&
          cryptoHandles.length !== fio_addresses.length) ||
        (domains.length && fio_domains.length && domains.length !== fio_domains.length)
      ) {
        changed = true;
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
    if (wallet.data && wallet.data.isChangeBalanceNotificationCreateStopped) {
      return;
    }

    const newlyCreated = wallet.publicWalletData && wallet.publicWalletData.newlyCreated;

    try {
      let balance = 0;
      try {
        const publicFioSDK = await fioApi.getPublicFioSDK();
        const balanceResponse = await publicFioSDK.getFioBalance(wallet.publicKey);
        balance = balanceResponse.balance;
      } catch (e) {
        if (
          (e.errorCode === ERROR_CODES.NOT_FOUND || e.code === ERROR_CODES.NOT_FOUND) &&
          e.json &&
          e.json.message &&
          /Public key not found/i.test(e.json.message)
        ) {
          logger.info(
            `Process wallet skip - id: ${(wallet && wallet.id) || 'N/A'} - info - ${
              e.message
            } - detailed message - ${e.json.message} - action - checkBalance`,
          );
          return;
        } else {
          logger.error(
            `Process wallet error - id: ${(wallet && wallet.id) || 'N/A'} - error - ${
              e.message
            } - detailed message - ${(e.json && e.json.message) ||
              'N/A'} - action - checkBalance`,
          );
        }
        throw new Error(e);
      }
      const { publicWalletData } = wallet;

      if (publicWalletData.balance === null) {
        publicWalletData.balance = 0;
      }

      let previousBalance = publicWalletData.balance;
      if (!new MathOp(previousBalance).eq(balance)) {
        const existsNotification = await Notification.findOne({
          where: {
            type: Notification.TYPE.INFO,
            contentType: Notification.CONTENT_TYPE.BALANCE_CHANGED,
            userId: wallet.User.id,
            data: {
              emailData: {
                wallet: wallet.publicKey,
              },
            },
          },
          order: [['createdAt', 'DESC']],
        });

        const alreadyHasPendingNotification =
          existsNotification &&
          !Var.updateRequired(
            existsNotification.emailDate || existsNotification.createdAt,
            HOUR_MS,
          ) &&
          !existsNotification.emailDate;

        if (alreadyHasPendingNotification) {
          previousBalance = fioApi.amountToSUF(
            new MathOp(existsNotification.data.emailData.newFioBalance)
              .sub(existsNotification.data.emailData.fioBalanceChange)
              .toString(),
          );
        }

        const roe = await getROE();
        const fioNativeChangeBalance = new MathOp(balance)
          .sub(previousBalance)
          .toString();
        const usdcChangeBalance = fioApi.convertFioToUsdc(
          new MathOp(fioNativeChangeBalance).abs().toString(),
          roe,
        );
        const usdcBalance = fioApi.convertFioToUsdc(balance, roe);
        const sign = new MathOp(fioNativeChangeBalance).gt(0) ? '+' : '-';

        if (alreadyHasPendingNotification) {
          await existsNotification.update({
            data: {
              ...existsNotification.data,
              emailData: {
                ...existsNotification.data.emailData,
                fioBalanceChange: `${sign}$${usdcChangeBalance} (${fioApi.sufToAmount(
                  new MathOp(fioNativeChangeBalance).abs().toString(),
                )} FIO)`,
                newFioBalance: `$${usdcBalance} (${fioApi.sufToAmount(
                  balance || 0,
                )} FIO)`,
                date: await User.formatDateWithTimeZone(wallet.User.id),
              },
            },
          });
        } else {
          if (wallet.User.emailNotificationParams.fioBalanceChange && !newlyCreated) {
            await Notification.create({
              type: Notification.TYPE.INFO,
              contentType: Notification.CONTENT_TYPE.BALANCE_CHANGED,
              userId: wallet.User.id,
              data: {
                pagesToShow: ['/'],
                emailData: {
                  fioBalanceChange: `${sign}$${usdcChangeBalance} (${fioApi.sufToAmount(
                    new MathOp(fioNativeChangeBalance).abs().toString(),
                  )} FIO)`,
                  newFioBalance: `$${usdcBalance} (${fioApi.sufToAmount(
                    balance || 0,
                  )} FIO)`,
                  wallet: wallet.publicKey,
                  date: await User.formatDateWithTimeZone(wallet.User.id),
                },
              },
            });
          }
        }

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
          where: { status: { [Op.ne]: User.STATUS.BLOCKED } },
        },
        { model: PublicWalletData, as: 'publicWalletData' },
      ],
      order: [['id', 'ASC']],
      offset,
      limit: ITEMS_PER_FETCH,
      raw: true,
      nest: true,
    });
  }

  async getDomainsWatchList(offset = 0) {
    return DomainsWatchlist.listAll({
      include: {
        model: User,
      },
      offset,
      limit: ITEMS_PER_FETCH,
    });
  }

  async execute() {
    await fioApi.getRawAbi();

    try {
      await fioApi.checkFioChainEnvironment();
    } catch (e) {
      logger.error(`WALLET PROCESSING ERROR`, e);
      this.finish();
    }

    let offset = 0;
    let domainsWatchlistOffset = 0;

    const processWallet = wallet => async () => {
      if (this.isCancelled || !wallet.User.email) return false;

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
        wallet.publicWalletData.createdAt = newItem.createdAt;
        wallet.publicWalletData.newlyCreated = true;
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

    const processDomainWatchlist = domainsWatchlistItem => async () => {
      if (this.isCancelled) return false;

      if (DEBUG_INFO)
        this.postMessage(`Process domain watchlist - ${domainsWatchlistItem.id}`);

      try {
        await Promise.allSettled([this.checkDomainsWatchlist(domainsWatchlistItem)]);
      } catch (e) {
        logger.error(`DOMAINS WATCHLIST PROCESSING ERROR`, e);
      }

      return true;
    };

    let wallets = await this.getWallets();
    let domainsWatchlist = await this.getDomainsWatchList();

    while (domainsWatchlist.length) {
      if (DEBUG_INFO)
        this.postMessage(
          `Process domains watchlist - ${domainsWatchlist.length} / ${domainsWatchlistOffset}`,
        );

      const methods = domainsWatchlist.map(domainsWatchlistItem =>
        processDomainWatchlist(domainsWatchlistItem),
      );

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

      domainsWatchlistOffset += ITEMS_PER_FETCH;
      domainsWatchlist = await this.getDomainsWatchList(domainsWatchlistOffset);
    }

    while (wallets.length) {
      try {
        if (DEBUG_INFO)
          this.postMessage(`Process wallets - ${wallets.length} / ${offset}`);

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
      } catch (err) {
        logger.error('PROCESS WALLETS LOOP ERROR', err);
      }
    }

    this.finish();
  }
}

new WalletDataJob().execute();
