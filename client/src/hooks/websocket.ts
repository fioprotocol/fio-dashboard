import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import apis from '../api';
import { log } from '../util/general';

import useEffectOnce from './general';

import { isAuthenticated } from '../redux/profile/selectors';

import config from '../config';
import { AUTH_REQ_ENDPOINTS } from '../constants/websocket';
import { QUERY_PARAMS_NAMES } from '../constants/queryParams';

import { AnyObject } from '../types';

export type Options = {
  endpoint: string;
  params: AnyObject;
  onOpen?: () => void;
  onMessage?: (data: AnyObject) => void;
  onClose?: (e: Error) => void;
  onError?: (msg: string) => void;
};

export function useWebsocket({
  endpoint,
  params,
  onOpen,
  onMessage,
  onClose,
  onError,
}: Options): WebSocket {
  const isAuth = useSelector(isAuthenticated);
  const [ws, setWs] = useState(null);

  const authCondition = AUTH_REQ_ENDPOINTS[endpoint] ? isAuth : true;
  const queryString = new URLSearchParams(params).toString();

  useEffect(
    () => () => {
      ws && ws.close();
    },
    [ws],
  );

  const createWebSocketConnection = useCallback(() => {
    let query = `?${QUERY_PARAMS_NAMES.ENDPOINT}=${endpoint}&${queryString}`;
    if (AUTH_REQ_ENDPOINTS[endpoint]) {
      query += `&${QUERY_PARAMS_NAMES.TOKEN}=${apis.client.token}`;
    }
    setWs(new WebSocket(`${config.wsBaseUrl}ws${query}`));
  }, [endpoint, queryString]);

  const connectWebSocket = useCallback(() => {
    // websocket onopen event listener
    ws.onopen = () => {
      onOpen && onOpen();
    };

    // websocket onclose event listener
    ws.onclose = (e: Error & { reason: string; wasClean: boolean }) => {
      if (e.wasClean) {
        onClose && onClose(e);
      } else {
        createWebSocketConnection();
      }
    };

    // websocket onerror event listener
    ws.onerror = (err: Error) => {
      log.error(`Socket encountered error: ${err.message}. Closing socket`);

      onError && onError(err.message);

      ws.close();
    };

    // websocket onerror event listener
    ws.onmessage = (evt: { data: string }) => {
      const message = JSON.parse(evt.data);
      onMessage && onMessage(message.data);
    };
  }, [createWebSocketConnection, onClose, onError, onMessage, onOpen, ws]);

  useEffectOnce(
    () => {
      createWebSocketConnection();
    },
    [],
    authCondition,
  );

  useEffect(() => {
    if (ws && authCondition) {
      connectWebSocket();
    }
  }, [authCondition, connectWebSocket, ws]);

  return ws;
}
