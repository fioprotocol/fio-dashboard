import React from 'react';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import ManagePageCtaBadge from '../../components/ManagePageContainer/ManagePageCtaBadge';

import { OrdersList } from './components/OrdersList/OrdersList';
import { useContext } from './OrdersPageContext';

import classes from './OrdersPage.module.scss';

const OrdersPage: React.FC = () => {
  const title = 'My Orders';

  const renderProps = useContext();

  return (
    <div className={classes.container}>
      <LayoutContainer title={title}>
        <div className={classes.dataContainer}>
          <p className={classes.subtitle}>
            View your order history and status of tokens, crypto handles and
            domains.
          </p>
          <OrdersList {...renderProps} />
        </div>
      </LayoutContainer>
      <div className={classes.actionBadgeContainer}>
        <ManagePageCtaBadge name="address" />
        <ManagePageCtaBadge name="domain" />
      </div>
    </div>
  );
};

export default OrdersPage;
