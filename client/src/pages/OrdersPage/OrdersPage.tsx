import React from 'react';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import { ManagePageCtaBadge } from '../../components/ManagePageContainer/ManagePageCtaBadge';

import { OrdersList } from './components/OrdersList/OrdersList';
import { useContext } from './OrdersPageContext';

import { CTA_BADGE_TYPE } from '../../components/ManagePageContainer/constants';

import classes from './OrdersPage.module.scss';

const OrdersPage: React.FC = () => {
  const title = 'My Orders';

  const renderProps = useContext();

  const { isNoProfileFlow } = renderProps;

  return (
    <div className={classes.container}>
      <LayoutContainer title={title}>
        <div className={classes.dataContainer}>
          <p className={classes.subtitle}>
            View your order history and status of tokens, FIO Handles and
            domains.
          </p>
          <OrdersList {...renderProps} />
        </div>
      </LayoutContainer>
      {!isNoProfileFlow && (
        <div className={classes.actionBadgeContainer}>
          <ManagePageCtaBadge name={CTA_BADGE_TYPE.ADDRESS} />
          <ManagePageCtaBadge name={CTA_BADGE_TYPE.DOMAIN} />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
