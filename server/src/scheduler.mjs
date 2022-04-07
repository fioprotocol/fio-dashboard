import path from 'path';

import dotenv from 'dotenv-safe';
import Bree from 'bree';

import logger from './logger';

const JOBS_PATH = path.resolve('server/src/jobs');

dotenv.load();

const bree = new Bree({
  root: false,
  jobs: [
    {
      path: path.join(JOBS_PATH, 'emails.mjs'),
      name: 'emails',
      interval: process.env.EMAILS_JOB_INTERVAL,
      timeout: process.env.EMAILS_JOB_TIMEOUT,
      closeWorkerAfterMs: 60 * 1000, // 1 min
    },
    {
      path: path.join(JOBS_PATH, 'wallet-data.mjs'),
      name: 'wallet-data',
      interval: process.env.WALLET_DATA_JOB_INTERVAL,
      timeout: 0,
      closeWorkerAfterMs: 5 * 60 * 1000, // 5 min
    },
  ],
  workerMessageHandler: (name, message) => {
    logger.info('JOB MESSAGE === ', name, message);
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
