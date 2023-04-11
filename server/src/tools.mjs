import jp from 'jsonpath';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';

import logger from './logger';
import Exception from './services/Exception';

const SALT_ROUND = 10;

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
    ...(req.adminUser || {}),
    ipAddress: getIpAddress(req),
    userAgent: req.headers['user-agent'],
    referer: req.headers.referer,
  });

export async function runService(service, { context = {}, params = {}, res }) {
  const startTime = Date.now();
  const actionName = service.name;

  const cleanParams = cleanup(params, service.paramsSecret, service.paramsCleanup);

  try {
    const result = await new service({
      context,
      res,
    }).run(params);

    if (service.resultSecret[0] !== '*') {
      const cleanResult = cleanup(result, service.resultSecret, service.resultCleanup);

      logRequest({
        type: 'info',
        actionName,
        params: cleanParams,
        result: cleanResult,
        startTime,
        userId: context.id,
      });
    }

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

export async function runWsService(service, { wsConnection, context = {}, params = {} }) {
  const startTime = Date.now();
  const actionName = service.name;

  const cleanParams = cleanup(params, service.paramsSecret, service.paramsCleanup);

  try {
    const result = await new service({
      context,
      wsConnection,
    }).run(params);

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
  contextBuilder = defaultContextBuilder,
) {
  return async function serviceRunner(req, res) {
    const params = paramsBuilder(req, res);
    const cleanParams = cleanup(params, service.paramsSecret, service.paramsCleanup);
    const resultPromise = runService(service, {
      params,
      context: contextBuilder(req, res),
      res,
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
      if (error.status) res.status(error.status);
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
          message: 'Please, contact your system administrator!',
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

function getIpAddress(req) {
  let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // first address of xff, list is comma separated
  if (ipAddress && ipAddress.indexOf(',') > -1) {
    ipAddress = ipAddress.split(',')[0];
  } else if (ipAddress === '') {
    ipAddress = req.ip;
  }
  // strip the port if present.
  const stripPort = ipAddress.split(':');
  if (stripPort.length === 2) {
    ipAddress = stripPort[0];
  } else if (stripPort.length === 7) {
    stripPort.pop();
    ipAddress = stripPort.join(':');
  }

  return ipAddress;
}

export function generateHash(string, salt = SALT_ROUND) {
  return bcrypt.hashSync(string, salt);
}

export function compareHashString(string, hash) {
  return bcrypt.compareSync(string, hash);
}

export async function authCheck(req, res, next, model, isAdmin) {
  const promise = runService(model, {
    params: { token: req.header('Authorization') },
  });

  try {
    if (isAdmin) {
      req.adminUser = await promise;
    } else {
      req.user = await promise;
    }

    return next();
  } catch (e) {
    return renderPromiseAsJson(req, res, promise, { token: '<secret>' });
  }
}

export async function authCheckSimple(req, res, next, model) {
  const promise = runService(model, {
    params: req.params,
  });

  try {
    req.params.value = await promise;
    return next();
  } catch (e) {
    return renderPromiseAsJson(req, res, promise);
  }
}

export function adminTfaValidate(base32secret, userToken) {
  return speakeasy.totp.verify({
    secret: base32secret,
    encoding: 'base32',
    token: userToken,
  });
}

export async function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
