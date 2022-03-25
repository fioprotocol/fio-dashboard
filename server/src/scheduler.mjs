import path from 'path';
import Bree from 'bree';

import logger from './logger';

const JOBS_PATH = path.resolve('server/src/jobs');

const bree = new Bree({
  root: false,
  jobs: [
    {
      path: path.join(JOBS_PATH, 'emails.mjs'),
      name: 'emails',
      // interval: '1m',
      interval: '15s',
      timeout: 0,
      closeWorkerAfterMs: 60 * 1000, // 1 min
    },
    {
      path: path.join(JOBS_PATH, 'wallet-data.mjs'),
      name: 'wallet-data',
      interval: '1m',
      timeout: 0,
      closeWorkerAfterMs: 5 * 60 * 1000, // 5 min
    },
  ],
  workerMessageHandler: (name, message) => {
    logger.info('JOB MESSAGE === ', name, message);
  },
});

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();

bree.on('worker created', name => {
  logger.info('JOB LOG. Worker created: ', name);
});

bree.on('worker deleted', name => {
  logger.info('JOB LOG. Worker deleted: ', name);
});

logger.info(`SCHEDULER IS RUNNING`);
