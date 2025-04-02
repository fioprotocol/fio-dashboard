import url from 'url';

import omit from 'lodash/omit';

import { WebSocketServer } from 'ws';

import AuthCheckResolver from './services/auth/CheckResolver.mjs';
import Exception from './services/Exception.mjs';
import WsOrderStatus from './services/orders/WsStatus.mjs';

import { runService, runWsService, AUTH_TYPE } from './tools.mjs';
import logger from './logger.mjs';
import X from './services/Exception.mjs';

const WS_ENDPOINTS = {
  NOTIFICATIONS: 'NOTIFICATIONS',
  ORDER_STATUS: 'ORDER_STATUS',
};

const checkAuth = async token => {
  const { payload } = await runService(AuthCheckResolver, {
    params: { token: `Bearer ${token}`, supportedTypes: [AUTH_TYPE.USER] },
  });

  return { id: payload.id };
};

const runWs = async (service, wsConnection, context, params, isPrivate = true) => {
  try {
    if (isPrivate && !params.isNoProfileFlow) {
      const userParams = await checkAuth(params.token);
      context = { ...context, ...userParams };
    }

    const restParams = omit(params, ['endpoint', 'token']);

    await runWsService(service, {
      wsConnection,
      context,
      params: { data: restParams },
    });
  } catch (e) {
    if (e instanceof Exception) {
      wsConnection.send(
        JSON.stringify({
          status: 0,
          error: e.toHash(),
        }),
      );
    } else {
      logger.error({
        REQUEST_URL: wsConnection.url,
        REQUEST_PARAMS: params,
        ERROR_STACK: e.stack,
      });

      wsConnection.send(
        JSON.stringify({
          status: 0,
          error: {
            code: 'SERVER_ERROR',
            message: 'Please, contact your system administrator!',
          },
        }),
      );
    }
  }
};

export default expressServer => {
  const websocketServer = new WebSocketServer({
    noServer: true,
    path: '/ws',
  });

  expressServer.on('upgrade', (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, websocket => {
      websocketServer.emit('connection', websocket, request);
    });
  });

  websocketServer.on('connection', (websocketConnection, connectionRequest) => {
    const connectionUrl = connectionRequest && connectionRequest.url;
    let queryParams;
    try {
      queryParams = url.parse(connectionUrl, true).query;
    } catch (e) {
      logger.error(e);
    }

    if (!queryParams.endpoint) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          endpoint: 'NOT_FOUND',
        },
      });
    }

    switch (queryParams.endpoint) {
      case WS_ENDPOINTS.ORDER_STATUS: {
        runWs(WsOrderStatus, websocketConnection, {}, queryParams);
        break;
      }
      case WS_ENDPOINTS.NOTIFICATIONS: {
        // todo:
        break;
      }
      default:
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            endpoint: 'NOT_FOUND',
          },
        });
    }
  });

  return websocketServer;
};
