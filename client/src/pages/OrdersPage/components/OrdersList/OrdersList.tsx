import React from 'react';

import InfiniteScroll from '../../../../components/InfiniteScroll/InfiniteScroll';

import { OrderItem } from '../OrderItem/OrderItem';

import { UserOrderDetails } from '../../../../types';

import classes from './OrdersList.module.scss';

const TABLE_HEADERS_LIST = [
  'Date',
  'Order No.',
  'Amount',
  'Payment',
  'Status',
  'Actions',
];

type Props = {
  hasMoreOrders: boolean;
  isDesktop: boolean;
  loading: boolean;
  ordersList: UserOrderDetails[] | [];
  getMoreOrders: () => void;
  onDownloadClick: (id: string) => void;
  onPrintClick: (id: string) => void;
  onViewClick: (id: string) => void;
};

export const OrdersList: React.FC<Props> = props => {
  const {
    hasMoreOrders,
    loading,
    ordersList,
    getMoreOrders,
    onDownloadClick,
    onPrintClick,
    onViewClick,
  } = props;

  return (
    <InfiniteScroll
      hasNextPage={hasMoreOrders}
      loading={loading}
      onLoadMore={getMoreOrders}
    >
      <div className={classes.container}>
        {TABLE_HEADERS_LIST.map(headerItem => (
          <div className={classes.tableHeader} key={headerItem}>
            {headerItem}
          </div>
        ))}
        {ordersList.map(orderItem => (
          <OrderItem
            {...orderItem}
            key={orderItem.number}
            onDownloadClick={onDownloadClick}
            onPrintClick={onPrintClick}
            onViewClick={onViewClick}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
};
