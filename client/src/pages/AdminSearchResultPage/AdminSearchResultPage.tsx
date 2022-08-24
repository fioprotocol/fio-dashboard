import React from 'react';

import Loader from '../../components/Loader/Loader';
import AdminOrdersSearchResult from './components/AdminOrdersSearchResult';

import { AdminSearchResult, OrderItem } from '../../types';

import classes from './AdminSearchResultPage.module.scss';

type Props = {
  adminSearch?: AdminSearchResult;
  loading: boolean;
  orderItem: OrderItem;
  getOrder: (id: string) => Promise<void>;
};

const AdminSearchResultPage: React.FC<Props> = props => {
  const { adminSearch, loading, getOrder, orderItem } = props;

  return (
    <div>
      {loading && <Loader />}

      {!adminSearch?.result ||
      (!adminSearch.result.users?.length &&
        !adminSearch.result.orders?.length) ? (
        <div className={classes.infoTitle}>Nothing found</div>
      ) : (
        <>
          <div className={classes.infoTitle}>Search results</div>
          <AdminOrdersSearchResult
            orderItem={orderItem}
            getOrder={getOrder}
            orders={adminSearch.result.orders}
          />
        </>
      )}
    </div>
  );
};

export default AdminSearchResultPage;
