import React from 'react';

import Loader from '../../components/Loader/Loader';
import AdminOrdersSearchResult from './components/AdminOrdersSearchResult';

import { AdminSearchResult, OrderDetails } from '../../types';

import classes from './AdminSearchResultPage.module.scss';

type Props = {
  adminSearch?: AdminSearchResult;
  loading: boolean;
  orderItem: OrderDetails;
  getOrder: (id: string) => Promise<void>;
};

const AdminSearchResultPage: React.FC<Props> = props => {
  const { adminSearch, loading, getOrder, orderItem } = props;

  if (loading && !adminSearch?.result) {
    return <div className="w-100 mt-5">{loading && <Loader />}</div>;
  }

  return (
    <div className="w-100">
      {!adminSearch?.result ||
      (!adminSearch.result.users?.length &&
        !adminSearch.result.orders?.length) ? (
        <div className={classes.infoTitle}>Nothing found</div>
      ) : (
        <>
          <div className={classes.infoTitle}>Search results</div>
          <div className="mt-3">{loading && <Loader />}</div>
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
