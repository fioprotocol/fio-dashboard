import Sequelize from 'sequelize';
import { parentPort } from 'worker_threads';

import '../db';
import { fioApi } from '../external/fio.mjs';
import { User, Wallet, PublicWalletData, Notification } from '../models/index.mjs';

import logger from '../logger.mjs';

import { DOMAIN_EXP_PERIOD } from '../config/constants.js';

const LOW_BUNDLES_THRESHOLD = 25;
const DAYS_30 = 1000 * 60 * 60 * 24 * 30;
const DOMAIN_EXP_TABLE = {
  5: null,
  4: DOMAIN_EXP_PERIOD.ABOUT_TO_EXPIRE,
  3: DOMAIN_EXP_PERIOD.EXPIRED_30,
  2: DOMAIN_EXP_PERIOD.EXPIRED_90,
  1: DOMAIN_EXP_PERIOD.EXPIRED_90,
  0: DOMAIN_EXP_PERIOD.EXPIRED,
};

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', message => {
    if (message === 'cancel') isCancelled = true;
  });

const postMessage = message => {
  if (parentPort) parentPort.postMessage(message);
};

const logFioError = e => {
  if (e.errorCode !== 404) logger.error(e);
};

const returnDayRange = timePeriod => {
  if (timePeriod > DAYS_30) return DAYS_30 + 1;
  if (timePeriod < -DAYS_30 * 3) return -DAYS_30 * 3 - 1;

  return timePeriod;
};

const checkRequests = async wallet => {
  const walletSdk = fioApi.getWalletSdkInstance(wallet.publicKey);
  const {
    publicWalletData: { meta },
  } = wallet;

  let sentRequests = [];
  let receivedRequests = [];
  let changed = false;

  try {
    const {
      publicWalletData: {
        requests: { sent },
      },
    } = wallet;
    const requestsResponse = await walletSdk.getSentFioRequests(0, 0, true);

    sentRequests = requestsResponse.requests;

    if (!sent.length && sentRequests.length) {
      changed = true;
      sent.push(...sentRequests);
    }

    for (const request of sent) {
      const fetchedItem = sentRequests.find(
        fetchedRequest =>
          fetchedRequest.fio_request_id === request.fio_request_id &&
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
            emailTemplate: '',
            emailData: {
              request: fetchedItem,
              date: new Date(),
            },
          },
        });
      }
    }
  } catch (e) {
    logFioError(e);
  }

  try {
    const {
      publicWalletData: {
        requests: { received },
        meta: { receivedRequestsOffset },
      },
    } = wallet;
    const requestsResponse = await walletSdk.getReceivedFioRequests(
      0,
      receivedRequestsOffset,
      true,
    );
    receivedRequests = requestsResponse.requests;

    if (!received.length && receivedRequests.length) {
      changed = true;
      meta.receivedRequestsOffset = receivedRequests.length - 1;
      received.push(...receivedRequests);
    }

    if (received.length && receivedRequests.length) {
      changed = true;

      meta.receivedRequestsOffset = receivedRequestsOffset + receivedRequests.length;

      for (const fetchedItem of receivedRequests) {
        const existed = received.find(
          request => fetchedItem.fio_request_id === request.fio_request_id,
        );
        if (!existed) {
          await Notification.create({
            type: Notification.TYPE.INFO,
            contentType: Notification.CONTENT_TYPE.NEW_FIO_REQUEST,
            userId: wallet.User.id,
            data: {
              pagesToShow: ['/'],
              emailTemplate: '',
              emailData: {
                request: fetchedItem,
                date: new Date(),
              },
            },
          });
        }
      }
    }
  } catch (e) {
    logFioError(e);
  }

  if (changed) {
    await PublicWalletData.update(
      {
        requests: { sent: sentRequests, received: receivedRequests },
        meta,
      },
      { where: { id: wallet.publicWalletData.id } },
    );
  }
};

const checkBalance = async wallet => {
  try {
    const { balance } = await fioApi.publicFioSDK.getFioBalance(wallet.publicKey);
    const { publicWalletData } = wallet;

    if (publicWalletData.balance === null) {
      publicWalletData.balance = balance;
      await PublicWalletData.update({ balance }, { where: { id: publicWalletData.id } });
    }

    if (Number(publicWalletData.balance) !== balance) {
      await Notification.create({
        type: Notification.TYPE.INFO,
        contentType: Notification.CONTENT_TYPE.BALANCE_CHANGED,
        userId: wallet.User.id,
        data: {
          pagesToShow: ['/'],
          emailTemplate: '',
          emailData: {
            balanceChange: balance - Number(publicWalletData.balance),
            newBalance: balance,
            date: new Date(),
          },
        },
      });

      await PublicWalletData.update({ balance }, { where: { id: publicWalletData.id } });
    }
  } catch (e) {
    logFioError(e);
  }
};

const checkFioNames = async wallet => {
  try {
    const {
      publicWalletData: { cryptoHandles, domains },
    } = wallet;
    const { fio_addresses, fio_domains } = await fioApi.publicFioSDK.getFioNames(
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
        item =>
          item.fio_address === cryptoHandle.fio_address &&
          item.remaining_bundled_tx !== cryptoHandle.remaining_bundled_tx,
      );
      if (fetched) {
        changed = true;
        if (
          fetched.remaining_bundled_tx < LOW_BUNDLES_THRESHOLD &&
          cryptoHandle.remaining_bundled_tx >= LOW_BUNDLES_THRESHOLD
        ) {
          await Notification.create({
            type: Notification.TYPE.INFO,
            contentType: Notification.CONTENT_TYPE.LOW_BUNDLE_TX,
            userId: wallet.User.id,
            data: {
              pagesToShow: ['/'],
              emailTemplate: '',
              emailData: {
                cryptoHandle: { ...fetched },
                date: new Date(),
              },
            },
          });
        }
      }
    }

    for (const domain of domains) {
      const fetchedDomain = fio_domains.find(
        item =>
          item.fio_domain === domain.fio_domain && item.expiration !== domain.expiration,
      );
      if (fetchedDomain) {
        changed = true;
        domain.expiration = fetchedDomain.expiration;
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
              domain: { fio_domain: domain.fio_domain, expiration: domain.expiration },
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
              emailTemplate: '',
              emailData: {
                domain: { ...domain },
                domainExpPeriod,
                date: new Date(),
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
    logFioError(e);
  }
};

(async () => {
  const wallets = await Wallet.findAll({
    include: [
      {
        model: User,
        where: { status: { [Sequelize.Op.ne]: User.STATUS.BLOCKED } },
      },
      { model: PublicWalletData, as: 'publicWalletData' },
    ],
    raw: true,
    nest: true,
  });

  postMessage(`Process wallets - ${wallets.length}`);

  const processWallet = async wallet => {
    if (isCancelled) return false;

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
    }

    try {
      await Promise.allSettled([
        checkBalance(wallet),
        checkFioNames(wallet),
        checkRequests(wallet),
      ]);
    } catch (e) {
      logger.error(`WALLET PROCESSING ERROR`, e);
    }

    return true;
  };

  const methods = wallets.map(wallet => processWallet(wallet));

  await Promise.allSettled(methods);

  process.exit(0);
})();
