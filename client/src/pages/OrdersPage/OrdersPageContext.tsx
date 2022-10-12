import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useEffectOnce } from '../../hooks/general';

import { useCheckIfDesktop } from '../../screenType';

import { getUserOrdersList } from '../../redux/orders/actions';

import {
  totalOrdersCount as totalOrdersCountSelector,
  loading as loadingSelector,
  ordersList as ordersListSelector,
} from '../../redux/orders/selectors';

import { UserOrderDetails } from '../../types';

const ORDERS_ITEMS_LIMIT = 25;

type Props = {
  hasMoreOrders: boolean;
  isDesktop: boolean;
  loading: boolean;
  ordersList: UserOrderDetails[];
  getMoreOrders: () => void;
  onDownloadClick: (orderId: string) => void;
  onPrintClick: (orderId: string) => void;
};

export const useContext = (): Props => {
  const totalOrdersCount = useSelector(totalOrdersCountSelector);
  const ordersList = useSelector(ordersListSelector);
  const loading = useSelector(loadingSelector);
  const dispatch = useDispatch();

  const [offset, setOffset] = useState<number>(0);

  const isDesktop = useCheckIfDesktop();
  const hasMoreOrders = totalOrdersCount - ordersList.length > 0;

  const getMoreOrders = () => {
    dispatch(getUserOrdersList(ORDERS_ITEMS_LIMIT, offset));
    setOffset(offset + ORDERS_ITEMS_LIMIT);
  };

  useEffectOnce(() => {
    dispatch(getUserOrdersList(ORDERS_ITEMS_LIMIT, offset));
    setOffset(offset + ORDERS_ITEMS_LIMIT);
  }, [dispatch, offset]);

  const onDownloadClick = (orderId: string) => {
    // todo: set download action
  };

  const onPrintClick = (orderId: string) => {
    // todo: set print action
  };

  return {
    hasMoreOrders,
    isDesktop,
    loading,
    ordersList,
    getMoreOrders,
    onDownloadClick,
    onPrintClick,
  };
};
