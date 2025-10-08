import path from 'path';

import dotenv from 'dotenv-safe';
import Bree from 'bree';

import logger from './logger';

import config from './config/index.mjs';

const JOBS_PATH = path.resolve('server/src/jobs');

const { cronJobs } = config || {};

const HALF_A_MINUTE_IN_MILISECONDS = 30 * 1000;
const ONE_MINUTE_IN_MILISECONDS = 60 * 1000;
const FIVE_MINUTES_IN_MILISECONDS = ONE_MINUTE_IN_MILISECONDS * 5;
const ONE_HOUR_IN_MILISECONDS = ONE_MINUTE_IN_MILISECONDS * 60;
const ONE_DAY_IN_MILISECONDS = ONE_HOUR_IN_MILISECONDS * 24;

dotenv.load();

const availableJobsParams = {
  emails: {
    path: path.join(JOBS_PATH, 'emails.mjs'),
    name: 'emails',
    interval: cronJobs.emailsInterval,
    timeout: cronJobs.emailsTimeout,
    closeWorkerAfterMs: ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  walletData: {
    path: path.join(JOBS_PATH, 'wallet-data.mjs'),
    name: 'wallet-data',
    interval: cronJobs.walletDataInterval,
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(cronJobs.walletDataCloseTimeout) || ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  orders: {
    path: path.join(JOBS_PATH, 'orders.mjs'),
    name: 'orders',
    interval: cronJobs.ordersInterval,
    timeout: 0,
    closeWorkerAfterMs: FIVE_MINUTES_IN_MILISECONDS, // 5 min
  },
  txCheck: {
    path: path.join(JOBS_PATH, 'tx-check.mjs'),
    name: 'tx-check',
    interval: cronJobs.ordersInterval || HALF_A_MINUTE_IN_MILISECONDS, // 30 sec default
    timeout: 0,
    closeWorkerAfterMs: FIVE_MINUTES_IN_MILISECONDS, // 5 min
  },
  wrapStatus: {
    path: path.join(JOBS_PATH, 'wrap-status.mjs'),
    name: 'wrap-status',
    interval: cronJobs.wrapStatusInterval || ONE_MINUTE_IN_MILISECONDS, // 60 sec
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(cronJobs.wrapStatusCloseTimeout) || ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  missingBcTxs: {
    path: path.join(JOBS_PATH, 'get-missed-bc-txs.mjs'),
    name: 'missed-bc-txs',
    interval: cronJobs.missedBcTxsInterval || ONE_MINUTE_IN_MILISECONDS * 55, // 55 min
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(cronJobs.missedBcTxsCloseTimeout) || ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  payments: {
    path: path.join(JOBS_PATH, 'payments.mjs'),
    name: 'payments',
    interval: cronJobs.paymentsInterval || HALF_A_MINUTE_IN_MILISECONDS, // 30 sec
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(cronJobs.paymentsCloseTimeout) || ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  cart: {
    path: path.join(JOBS_PATH, 'cart.mjs'),
    name: 'cart',
    interval: cronJobs.cartInterval || ONE_DAY_IN_MILISECONDS, // 1 day
    timeout: 0,
    closeWorkerAfterMs: parseInt(cronJobs.cartCloseTimeout) || ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  gatedRegistrationTokens: {
    path: path.join(JOBS_PATH, 'gated-registrations.mjs'),
    name: 'gated-registrations',
    interval: cronJobs.gatedRegistrationTokensInterval || ONE_DAY_IN_MILISECONDS, // 1 day
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(cronJobs.gatedRegistrationTokensCloseTimeout) || ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  domainsExpiration: {
    path: path.join(JOBS_PATH, 'domains-expiration.mjs'),
    name: 'domains-expiration',
    interval: cronJobs.domainsExpirationInterval || ONE_DAY_IN_MILISECONDS, // 1 day
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(cronJobs.domainsExpirationCloseTimeout) || ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  apiUrls: {
    path: path.join(JOBS_PATH, 'api-urls.mjs'),
    name: 'api-urls',
    cron: `${cronJobs.apiUrlsInterval}`.replace(/\\\*/g, '*'),
    timeout: 0,
    closeWorkerAfterMs: ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  retryForkedTransactions: {
    path: path.join(JOBS_PATH, 'retry-forked-transactions.mjs'),
    name: 'retry-forked-transactions',
    interval: cronJobs.retryForkedTransactions || ONE_MINUTE_IN_MILISECONDS * 5, // 5 min
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(cronJobs.retryForkedTransactionsCloseTimeout) || ONE_HOUR_IN_MILISECONDS, // 60 min
  },
  fioProxies: {
    path: path.join(JOBS_PATH, 'fio-proxies.mjs'),
    name: 'fio-proxies',
    interval: cronJobs.fioProxiesInterval || ONE_DAY_IN_MILISECONDS, // 1 day
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(cronJobs.fioProxiesCloseTimeout) || ONE_HOUR_IN_MILISECONDS, // 60 min
  },
};

const jobsToLaunch = cronJobs.jobsList;
const jobs = jobsToLaunch
  ? jobsToLaunch.split(',').map(jobKey => availableJobsParams[jobKey])
  : [];

const bree = new Bree({
  root: false,
  jobs,
  workerMessageHandler: message => {
    logger.info('JOB MESSAGE === ', message || '');
  },
});

bree.start();

bree.on('worker created', name => {
  logger.info('JOB LOG. Worker created: ', name);
});

bree.on('worker deleted', name => {
  logger.info('JOB LOG. Worker deleted: ', name);
});

logger.info(`SCHEDULER IS RUNNING`);
