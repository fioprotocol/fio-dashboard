import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AdminContainer from './components/AdminContainer';
import MainLayout from './pages/MainLayout';
import ConfirmEmail from './pages/ConfirmEmail';
import AuthContainer from './components/AuthContainer';
import PrivateRoute from './components/PrivateRoute';
import FioAddressPage from './pages/FioAddressPage';
import FioAddressManage from './pages/FioAddressManagePage';
import FioDomainPage from './pages/FioDomainPage';
import FioDomainManagePage from './pages/FioDomainManagePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PurchasePage from './pages/PurchasePage';
import ScrollToTop from './components/ScrollToTop';
import FioAddressTransferPage from './pages/FioAddressTransferPage';
import FioDomainTransferPage from './pages/FioDomainTransferPage';
import FioAddressTransferSuccessPage from './pages/FioAddressTransferSuccessPage';
import FioDomainTransferSuccessPage from './pages/FioDomainTransferSuccessPage';
import FioDomainStatusChangePage from './pages/FioDomainStatusChangePage';
import FioDomainStatusChangeFinishPage from './pages/FioDomainStatusChangeFinishPage';

import { ROUTES } from './constants/routes';

const Routes = () => (
  <MainLayout>
    <ScrollToTop>
      <Switch>
        <Route path={ROUTES.HOME} component={HomePage} exact />
        <PrivateRoute path={ROUTES.ADMIN} component={AdminContainer} exact />
        <Route path={ROUTES.CONFIRM_EMAIL} component={ConfirmEmail} />
        <Route
          path={ROUTES.FIO_ADDRESSES_SELECTION}
          component={FioAddressPage}
          exact
        />
        <PrivateRoute
          path={ROUTES.FIO_ADDRESSES}
          component={FioAddressManage}
          exact
        />
        <Route
          path={ROUTES.FIO_DOMAINS_SELECTION}
          component={FioDomainPage}
          exact
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAINS}
          component={FioDomainManagePage}
          exact
        />
        <PrivateRoute path={ROUTES.CART} component={CartPage} exact />
        <PrivateRoute path={ROUTES.CHECKOUT} component={CheckoutPage} exact />
        <PrivateRoute path={ROUTES.PURCHASE} component={PurchasePage} exact />
        <PrivateRoute
          path={`${ROUTES.FIO_ADDRESS_OWNERSHIP}/:id`}
          component={FioAddressTransferPage}
        />
        <PrivateRoute
          path={`${ROUTES.FIO_DOMAIN_OWNERSHIP}/:id`}
          component={FioDomainTransferPage}
        />

        <PrivateRoute
          path={ROUTES.FIO_ADDRESS_TRANSFER_SUCCESS}
          component={FioAddressTransferSuccessPage}
          excat
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_TRANSFER_SUCCESS}
          component={FioDomainTransferSuccessPage}
          excat
        />

        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_STATUS_CHANGE}
          component={FioDomainStatusChangePage}
          excat
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_STATUS_FINISH}
          component={FioDomainStatusChangeFinishPage}
          excat
        />

        <AuthContainer />
      </Switch>
    </ScrollToTop>
  </MainLayout>
);

export default Routes;
