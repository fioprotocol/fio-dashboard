import jp from 'jsonpath';

import logger from './logger';
import Exception from './services/Exception';

const cleanup = (data, paths, callback, replacer = () => '<secret>') =>
  Array.isArray(paths)
    ? paths.reduce((acc, path) => {
        jp.apply(acc, path.startsWith('[') ? `$${path}` : `$.${path}`, replacer);
        return acc;
      }, cloneDeep(data))
    : callback(cloneDeep(data), replacer);

const defaultParamsBuilder = () => ({});
const defaultContextBuilder = req =>
  cloneDeep({
    ...(req.user || {}),
    ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
  });

export async function runService(service, { context = {}, params = {} }) {
  const startTime = Date.now();
  const actionName = service.name;

  const cleanParams = cleanup(params, service.paramsSecret, service.paramsCleanup);

  try {
    const result = await new service({
      context,
    }).run(params);

    const cleanResult = cleanup(result, service.resultSecret, service.resultCleanup);

    logRequest({
      type: 'info',
      actionName,
      params: cleanParams,
      result: cleanResult,
      startTime,
      userId: context.id,
    });

    return result;
  } catch (error) {
    if (error instanceof Exception) {
      logRequest({
        type: 'info',
        actionName,
        params: cleanParams,
        result: error,
        startTime,
      });
    } else {
      logRequest({
        type: 'error',
        actionName,
        params: cleanParams,
        result: error,
        startTime,
      });
    }

    throw error;
  }
}

export function makeServiceRunner(
  service,
  paramsBuilder = defaultParamsBuilder,
  contexBuilder = defaultContextBuilder,
) {
  return async function serviceRunner(req, res) {
    const params = paramsBuilder(req, res);
    const cleanParams = cleanup(params, service.paramsSecret, service.paramsCleanup);
    const resultPromise = runService(service, {
      params,
      context: contexBuilder(req, res),
    });

    return renderPromiseAsJson(req, res, resultPromise, cleanParams);
  };
}

export async function renderPromiseAsJson(req, res, promise, params) {
  try {
    const data = await promise;

    data.status = 1;

    return res.send(data);
  } catch (error) {
    if (error instanceof Exception) {
      res.send({
        status: 0,
        error: error.toHash(),
      });
    } else {
      logger.error({
        REQUEST_URL: req.url,
        REQUEST_PARAMS: params,
        ERROR_STACK: error.stack,
      });

      res.send({
        status: 0,
        error: {
          code: 'SERVER_ERROR',
          message: 'Please, contact your system administartor!',
        },
      });
    }
  }
}

function cloneDeep(data) {
  return JSON.parse(JSON.stringify(data));
}

function logRequest({ type, actionName, params, result, startTime, userId }) {
  defaultLogger(type, {
    service: actionName,
    runtime: Date.now() - startTime,
    params,
    result,
    userId,
  });
}

function defaultLogger(type, data) {
  const logMethodName =
    {
      error: 'error',
      info: 'info',
    }[type && type.toLowerCase()] || 'debug';

  logger[logMethodName](data);
}
