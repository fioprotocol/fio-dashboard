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
import FioAddressTransferResultsPage from './pages/FioAddressTransferResultsPage';
import FioDomainTransferResultsPage from './pages/FioDomainTransferResultsPage';
import FioDomainStatusChangePage from './pages/FioDomainStatusChangePage';
import FioDomainStatusChangeResultsPage from './pages/FioDomainStatusChangeResultsPage';
import FioAddressRenewPage from './pages/FioAddressRenewPage';
import FioDomainRenewPage from './pages/FioDomainRenewPage';
import FioNameRenewResultsPage from './pages/FioNameRenewResultsPage';
import LinkTokenListPage from './pages/LinkTokenListPages/LinkTokenListPage';
import LinkTokenPage from './pages/LinkTokenListPages/LinkTokenPage';
import EditTokenPage from './pages/LinkTokenListPages/EditTokenPage';
import DeleteTokenPage from './pages/LinkTokenListPages/DeleteTokenPage';

import { ROUTES } from './constants/routes';

const LIST_TOKEN_PARENT_ROUTE = `${ROUTES.LINK_TOKEN_LIST}/:id`;

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
          path={ROUTES.FIO_ADDRESS_TRANSFER_RESULTS}
          component={FioAddressTransferResultsPage}
          excat
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_TRANSFER_RESULTS}
          component={FioDomainTransferResultsPage}
          excat
        />

        <PrivateRoute
          path={`${ROUTES.FIO_DOMAIN_STATUS_CHANGE}/:id`}
          component={FioDomainStatusChangePage}
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_STATUS_CHANGE_RESULTS}
          component={FioDomainStatusChangeResultsPage}
          excat
        />

        <PrivateRoute
          path={`${ROUTES.FIO_ADDRESS_RENEW}/:id`}
          component={FioAddressRenewPage}
        />
        <PrivateRoute
          path={`${ROUTES.FIO_DOMAIN_RENEW}/:id`}
          component={FioDomainRenewPage}
        />
        <PrivateRoute
          path={ROUTES.FIO_NAME_RENEW_RESULTS}
          component={FioNameRenewResultsPage}
          excat
        />

        <PrivateRoute
          path={LIST_TOKEN_PARENT_ROUTE}
          component={LinkTokenListPage}
          exact
        />
        <PrivateRoute
          path={`${LIST_TOKEN_PARENT_ROUTE}/${ROUTES.LINK_TOKEN}`}
          component={LinkTokenPage}
        />
        <PrivateRoute
          path={`${LIST_TOKEN_PARENT_ROUTE}/${ROUTES.EDIT_TOKEN}`}
          component={EditTokenPage}
        />
        <PrivateRoute
          path={`${LIST_TOKEN_PARENT_ROUTE}/${ROUTES.DELETE_TOKEN}`}
          component={DeleteTokenPage}
        />

        <AuthContainer />
      </Switch>
    </ScrollToTop>
  </MainLayout>
);

export default Routes;
