import path from 'path';

import dotenv from 'dotenv-safe';
import Bree from 'bree';

import logger from './logger';

const JOBS_PATH = path.resolve('server/src/jobs');

dotenv.load();

const availableJobsParams = {
  emails: {
    path: path.join(JOBS_PATH, 'emails.mjs'),
    name: 'emails',
    interval: process.env.EMAILS_JOB_INTERVAL,
    timeout: process.env.EMAILS_JOB_TIMEOUT,
    closeWorkerAfterMs: 60 * 60 * 1000, // 60 min
  },
  walletData: {
    path: path.join(JOBS_PATH, 'wallet-data.mjs'),
    name: 'wallet-data',
    interval: process.env.WALLET_DATA_JOB_INTERVAL,
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(process.env.WALLET_DATA_JOB_CLOSE_TIMEOUT) || 60 * 60 * 1000, // 60 min
  },
  orders: {
    path: path.join(JOBS_PATH, 'orders.mjs'),
    name: 'orders',
    interval: process.env.ORDERS_JOB_INTERVAL,
    timeout: 0,
    closeWorkerAfterMs: 5 * 60 * 1000, // 5 min
  },
  txCheck: {
    path: path.join(JOBS_PATH, 'tx-check.mjs'),
    name: 'tx-check',
    interval: process.env.ORDERS_JOB_INTERVAL || 30 * 1000, // 30 sec default
    timeout: 0,
    closeWorkerAfterMs: 5 * 60 * 1000, // 5 min
  },
  wrapStatus: {
    path: path.join(JOBS_PATH, 'wrap-status.mjs'),
    name: 'wrap-status',
    interval: process.env.WRAP_STATUS_JOB_INTERVAL || 60 * 1000, // 60 sec
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(process.env.WRAP_STATUS_JOB_CLOSE_TIMEOUT) || 60 * 60 * 1000, // 60 min
  },
  missingBcTxs: {
    path: path.join(JOBS_PATH, 'get-missed-bc-txs.mjs'),
    name: 'missed-bc-txs',
    interval: process.env.MISSED_BC_TXS_JOB_INTERVAL || 55 * 60 * 1000, // 55 min
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(process.env.MISSED_BC_TXS_JOB_CLOSE_TIMEOUT) || 60 * 60 * 1000, // 60 min
  },
  payments: {
    path: path.join(JOBS_PATH, 'payments.mjs'),
    name: 'payments',
    interval: process.env.PAYMENTS_JOB_INTERVAL || 30 * 1000, // 30 sec
    timeout: 0,
    closeWorkerAfterMs:
      parseInt(process.env.PAYMENTS_JOB_CLOSE_TIMEOUT) || 60 * 60 * 1000, // 60 min
  },
  cart: {
    path: path.join(JOBS_PATH, 'cart.mjs'),
    name: 'cart',
    interval: process.env.CART_JOB_INTERVAL || 1000 * 60 * 60 * 24, // 1 day
    timeout: 0,
    closeWorkerAfterMs: parseInt(process.env.CART_JOB_CLOSE_TIMEOUT) || 60 * 60 * 1000, // 60 min
  },
};

const jobsToLaunch = process.env.JOB_LIST;
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
