import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

import useQuery from '../../hooks/useQuery';
import { useWebsocket } from '../../hooks/websocket';
import api from '../../api';

import { ORDER_NUMBER_PARAM_NAME } from '../../constants/order';
import { ROUTES } from '../../constants/routes';
import { WS_ENDPOINTS } from '../../constants/websocket';

import { isNoProfileFlow as isNoProfileFlowSelector } from '../../redux/refProfile/selectors';

import { OrderDetailed, PurchaseTxStatus } from '../../types';

export type ContextProps = {
  orderItem: OrderDetailed;
};

export const useContext = (): ContextProps => {
  const history = useHistory<{ orderId: string }>();
  const queryParams = useQuery();

  const isNoProfileFlow = useSelector(isNoProfileFlowSelector);

  const orderNumber = queryParams.get(ORDER_NUMBER_PARAM_NAME);
  const [orderItem, setOrderItem] = useState<OrderDetailed>(null);

  const token = api.client.getToken();

  useEffect(() => {
    if (!orderNumber) history.push(ROUTES.ORDERS);
  }, [orderNumber, history]);

  useEffect(() => {
    if (!token && !isNoProfileFlow) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isNoProfileFlow, token, history]);

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
    params: { orderNumber, ...(isNoProfileFlow && { isNoProfileFlow: true }) },
    onMessage: onStatusUpdate,
  });

  return { orderItem };
};
