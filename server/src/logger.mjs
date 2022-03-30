import util from 'util';

import bunyan from 'bunyan';

import Exception from './services/Exception';

const inspect = data => util.inspect(data, { showHidden: false, depth: null });

const logger = bunyan.createLogger({
  name: 'boilerplate',
  streams: [
    {
      name: 'stdout',
      level: process.env.LOG_LEVEL || 'trace',
      stream: process.stdout,
    },
    { name: 'stderr', level: 'error', stream: process.stderr },
  ],
  serializers: {
    error: bunyan.stdSerializers.err,
  },
});

function isServiceInfo(info) {
  return info !== null && typeof info === 'object' && info.service;
}

const devlogger = {
  info(...data) {
    if (data.length === 1 && isServiceInfo(data[0])) {
      const { service, runtime, params, result, userId } = data[0];
      const color = result instanceof Exception ? 33 : 32;
      const res = result instanceof Exception ? inspect(result.toHash()) : result;
      /* eslint-disable no-console */
      console.info(
        `\x1b[${color}m%s \x1b[35m%s \x1b[36m%s \x1b[0m`,
        service,
        `${runtime}ms`,
        userId || 'NOT_LOGGED',
      );
      console.info(`\x1b[${color}m%s \x1b[0m%s`, '====>', params);
      console.info(`\x1b[${color}m%s \x1b[0m%s`, '<====', res, '\n');
    } else {
      console.info(...data);
    }
  },
  error(err) {
    console.error(err);
  },
};

export default { devlogger, default: logger }[process.env.NODE_LOGGER_TYPE] || logger;
