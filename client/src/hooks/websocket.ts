import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useEffectOnce from './general';
import apis from '../api';

import { isAuthenticated } from '../redux/profile/selectors';

import config from '../config';
import { AUTH_REQ_ENDPOINTS } from '../constants/websocket';

import { AnyObject } from '../types';

export type Options = {
  endpoint: string;
  params: AnyObject;
  onOpen?: () => void;
  onMessage?: (msg: string) => void;
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
}: Options) {
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

  useEffectOnce(
    () => {
      let query = `?endpoint=${endpoint}&${queryString}`;
      if (AUTH_REQ_ENDPOINTS[endpoint]) {
        query += `&token=${apis.client.token}`;
      }
      setWs(new WebSocket(`${config.wsBaseUrl}ws${query}`));
    },
    [endpoint, isAuth, queryString],
    authCondition,
  );

  useEffectOnce(
    () => {
      // websocket onopen event listener
      ws.onopen = () => {
        onOpen && onOpen();
      };

      // websocket onclose event listener
      ws.onclose = (e: Error & { reason: string }) => {
        onClose && onClose(e);
      };

      // websocket onerror event listener
      ws.onerror = (err: Error) => {
        console.error(
          'Socket encountered error: ',
          err.message,
          'Closing socket',
        );

        onError && onError(err.message);

        ws.close();
      };

      // websocket onerror event listener
      ws.onmessage = (evt: { data: string }) => {
        const message = JSON.parse(evt.data);
        onMessage && onMessage(message);
      };
    },
    [ws],
    !!ws,
  );

  return ws;
}
