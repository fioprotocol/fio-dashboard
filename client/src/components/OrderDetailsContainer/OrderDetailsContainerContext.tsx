import { useState } from 'react';
import { useHistory } from 'react-router';

import { useWebsocket } from '../../hooks/websocket';

import { WS_ENDPOINTS } from '../../constants/websocket';

import { OrderDetailed, PurchaseTxStatus } from '../../types';

export type ContextProps = {
  orderItem: OrderDetailed;
};

export const useContext = (): ContextProps => {
  const history = useHistory<{ orderId: string }>();

  const {
    location: { state },
  } = history;
  const { orderId } = state || {};

  const [orderItem, setOrderItem] = useState<OrderDetailed>(null);

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
    params: { orderId: Number(orderId) },
    onMessage: onStatusUpdate,
  });

  return { orderItem };
};
