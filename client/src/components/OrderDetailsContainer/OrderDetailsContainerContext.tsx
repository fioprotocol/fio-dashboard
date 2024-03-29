import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import useQuery from '../../hooks/useQuery';
import { useWebsocket } from '../../hooks/websocket';
import api from '../../api';

import { ORDER_NUMBER_PARAM_NAME } from '../../constants/order';
import { ROUTES } from '../../constants/routes';
import { WS_ENDPOINTS } from '../../constants/websocket';

import { OrderDetailed, PurchaseTxStatus } from '../../types';

export type ContextProps = {
  orderItem: OrderDetailed;
};

export const useContext = (): ContextProps => {
  const history = useHistory<{ orderId: string }>();
  const queryParams = useQuery();

  const orderNumber = queryParams.get(ORDER_NUMBER_PARAM_NAME);
  const [orderItem, setOrderItem] = useState<OrderDetailed>(null);

  const token = api.client.getToken();

  useEffect(() => {
    if (!orderNumber) history.push(ROUTES.ORDERS);
  }, [orderNumber, history]);

  useEffect(() => {
    if (!token) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [token, history]);

  const onStatusUpdate = (data: {
    orderStatus: PurchaseTxStatus;
    results?: OrderDetailed;
  }) => {
    if (data) {
      const { orderStatus, results } = data;
      if (orderStatus && results) {
        setOrderItem(results);
      }
    }
  };

  useWebsocket({
    endpoint: WS_ENDPOINTS.ORDER_STATUS,
    params: { orderNumber },
    onMessage: onStatusUpdate,
  });

  return { orderItem };
};
