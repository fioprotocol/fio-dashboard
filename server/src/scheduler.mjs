import path from 'path';
import Bree from 'bree';

import logger from './logger';

const jobsPath = path.resolve('server/src/jobs');

const bree = new Bree({
  root: false,
  jobs: [
    {
      path: path.join(jobsPath, 'emails.mjs'),
      name: 'emails',
      // interval: '1m',
      interval: '15s',
      timeout: 0,
    },
  ],
});

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();

logger.info(`SCHEDULER IS RUNNING`);
