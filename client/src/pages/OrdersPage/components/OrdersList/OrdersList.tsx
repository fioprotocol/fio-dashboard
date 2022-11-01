import React from 'react';

import InfiniteScroll from '../../../../components/InfiniteScroll/InfiniteScroll';

import { OrderItemRender } from '../OrderItemRender';

import { OrdersPageProps } from '../../types';

import classes from './OrdersList.module.scss';

const TABLE_HEADERS_LIST = [
  'Date',
  'Order No.',
  'Amount',
  'Payment',
  'Status',
  'Actions',
];

export const OrdersList: React.FC<OrdersPageProps> = props => {
  const {
    hasMoreOrders,
    loading,
    ordersList,
    isDesktop,
    getMoreOrders,
    onDownloadClick,
    onPrintClick,
  } = props;

  return (
    <InfiniteScroll
      hasNextPage={hasMoreOrders}
      loading={loading}
      onLoadMore={getMoreOrders}
    >
      <div className={classes.container}>
        {isDesktop &&
          TABLE_HEADERS_LIST.map(headerItem => (
            <div className={classes.tableHeader} key={headerItem}>
              {headerItem}
            </div>
          ))}
        {ordersList.map(orderItem => (
          <OrderItemRender
            isDesktop={isDesktop}
            orderItem={orderItem}
            key={orderItem.number}
            onDownloadClick={onDownloadClick}
            onPrintClick={onPrintClick}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
};
