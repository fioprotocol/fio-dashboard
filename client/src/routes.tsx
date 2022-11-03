import React from 'react';
import { Route, Switch, RouteComponentProps, Redirect } from 'react-router-dom';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import MainLayout from './pages/MainLayout';
import AuthContainer from './components/AuthContainer';
import PrivateRoute from './components/PrivateRoute';
import FioAddressSelectionPage from './pages/FioAddressSelectionPage';
import FioAddressManage from './pages/FioAddressManagePage';
import FioDomainSelectionPage from './pages/FioDomainSelectionPage';
import FioDomainLandingPage from './pages/FioDomainLandingPage';
import FioDomainManagePage from './pages/FioDomainManagePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PurchasePage from './pages/PurchasePage';
import ScrollToTop from './components/ScrollToTop';
import FioAddressTransferPage from './pages/FioAddressTransferPage';
import FioDomainTransferPage from './pages/FioDomainTransferPage';
import FioDomainStatusChangePage from './pages/FioDomainStatusChangePage';
import FioAddressAddBundlesPage from './pages/FioAddressAddBundlesPage';
import FioDomainRenewPage from './pages/FioDomainRenewPage';
import TokenListPage from './pages/TokenListPage';
import DeleteTokenPage from './pages/DeleteTokenPage';
import AddTokenPage from './pages/AddTokenPage';
import EditTokenPage from './pages/EditTokenPage';
import SettingsPage from './pages/SettingsPage';
import RefHomePage from './pages/RefHomePage';
import AccountRecoveryPage from './pages/AccountRecoveryPage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookieNoticePage from './pages/CookieNoticePage';
import EmailConfirmGatePage from './pages/EmailConfirmGatePage';
import FioAddressSignaturesPage from './pages/FioAddressSignaturesPage';
import FioAddressSignPage from './pages/FioAddressSignPage';
import FioAddressNftPage from './pages/FioAddressNftPage';
import FioRequestDecryptPage from './pages/FioRequestDecryptPage';
import FioTokensRequestPage from './pages/FioTokensRequestPage';
import FioTokensReceivePage from './pages/FioTokensReceivePage';
import FioTokensGetPage from './pages/FioTokensGetPage';
import TokensRequestPaymentPage from './pages/TokensRequestPaymentPage';
import NftValidationPage from './pages/NftValidationPage';
import WalletsPage from './pages/WalletsPage';
import WalletPage from './pages/WalletPage';
import ImportWalletPage from './pages/ImportWalletPage';
import SendPage from './pages/SendPage';
import StakeTokensPage from './pages/StakeTokensPage';
import UnstakeTokensPage from './pages/UnstakeTokensPage';
import UpdateEmailConfirmGatePage from './pages/UpdateEmailConfirmGatePage';
import UpdateEmailPage from './pages/UpdateEmailPage';
import RejectFioRequestPage from './pages/RejectFioRequestPage';
import EmailConfirmationResultPage from './pages/EmailConfirmationResultsPage';
import NotFoundPage from './pages/NotFoundPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';

import AdminPrivateRoute from './components/AdminPrivateRoute';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminEmailConfirmPage from './pages/AdminEmailConfirmPage';
import AdminPasswordResetPage from './pages/AdminPasswordResetPage';
import AdminRegularUsersList from './pages/AdminRegularUsersListPage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminHomePage from './pages/AdminHomePage';
import AdminFioAccountsProfilesListPage from './pages/AdminFioAccountsProfilesListPage';
import AdminSearchResultPage from './pages/AdminSearchResultPage';

import { ROUTES } from './constants/routes';

import { LocationProps as AdminEmailConfirmPageLocationProps } from './pages/AdminEmailConfirmPage/types';
import { LocationProps as AdminPasswordResetPageLocationProps } from './pages/AdminPasswordResetPage/types';
import { LocationProps as EmailConfirmationPageLocationProps } from './pages/EmailConfirmationPage/EmailConfirmationPage';

const Routes = (): React.ReactElement => (
  <MainLayout>
    <ScrollToTop>
      <Switch>
        <Route
          path={ROUTES.FIO_ADDRESS_ADD_BUNDLES_OLD}
          component={(props: RouteComponentProps<{ name?: string }>) => (
            <Redirect
              to={`${ROUTES.FIO_ADDRESS_ADD_BUNDLES}?name=${props.match.params.name}`}
            />
          )}
        />
        <Route
          path={ROUTES.FIO_DOMAIN_RENEW_OLD}
          component={(props: RouteComponentProps<{ name?: string }>) => (
            <Redirect
              to={`${ROUTES.FIO_DOMAIN_RENEW}?name=${props.match.params.name}`}
            />
          )}
        />
        <Route
          path={ROUTES.FIO_REQUEST_OLD}
          component={(
            props: RouteComponentProps<{ publicKey?: string; id?: string }>,
          ) => (
            <Redirect
              to={`${ROUTES.FIO_REQUEST}?publicKey=${props.match.params.publicKey}&fioRequestId=${props.match.params.id}`}
            />
          )}
          exact
        />
        <Route
          path={ROUTES.FIO_WALLET_OLD}
          component={(props: RouteComponentProps<{ publicKey?: string }>) => (
            <Redirect
              to={`${ROUTES.FIO_WALLET}?publicKey=${props.match.params.publicKey}`}
            />
          )}
          exact
        />
        <Route
          path={ROUTES.ADMIN_CONFIRM_EMAIL_OLD}
          component={(
            props: RouteComponentProps<{ hash?: string }> &
              AdminEmailConfirmPageLocationProps,
          ) => (
            <Redirect
              to={`${ROUTES.ADMIN_CONFIRM_EMAIL}?hash=${
                props.match.params.hash
              }&email=${props.location.query.email || ''}`}
            />
          )}
          exact
        />
        <Route
          path={ROUTES.ADMIN_RESET_PASSWORD_OLD}
          component={(
            props: RouteComponentProps<{ hash?: string }> &
              AdminPasswordResetPageLocationProps,
          ) => (
            <Redirect
              to={`${ROUTES.ADMIN_RESET_PASSWORD}?hash=${
                props.match.params.hash
              }&email=${props.location.query.email || ''}`}
            />
          )}
          exact
        />
        <Route
          path={ROUTES.CONFIRM_EMAIL_OLD}
          component={(
            props: RouteComponentProps<{ hash?: string }> &
              EmailConfirmationPageLocationProps,
          ) => (
            <Redirect
              to={`${ROUTES.CONFIRM_EMAIL}?hash=${
                props.match.params.hash
              }&refCode=${props.location.query.refCode || ''}`}
            />
          )}
          exact
        />
        <Route
          path={ROUTES.CONFIRM_UPDATED_EMAIL_OLD}
          component={(props: RouteComponentProps<{ hash?: string }>) => (
            <Redirect
              to={`${ROUTES.CONFIRM_UPDATED_EMAIL}?hash=${props.match.params.hash}`}
            />
          )}
        />

        <Route path={ROUTES.HOME} component={HomePage} exact />
        <Route path={ROUTES.NOT_FOUND} component={NotFoundPage} exact />
        <Route path={ROUTES.REF_PROFILE_HOME} component={RefHomePage} exact />
        <Route
          path={ROUTES.CONFIRM_EMAIL}
          component={EmailConfirmationPage}
          exact
        />
        <Route
          path={ROUTES.CONFIRM_EMAIL_RESULT}
          component={EmailConfirmationResultPage}
          exact
        />
        <Route
          path={ROUTES.IS_NEW_USER}
          component={EmailConfirmGatePage}
          exact
        />
        <Route
          path={ROUTES.NEW_EMAIL_NOT_VERIFIED}
          component={UpdateEmailConfirmGatePage}
          exact
        />
        <Route
          path={ROUTES.CONFIRM_UPDATED_EMAIL}
          component={UpdateEmailPage}
          exact
        />
        <Route
          path={ROUTES.FIO_ADDRESSES_SELECTION}
          component={FioAddressSelectionPage}
          exact
        />
        <PrivateRoute
          path={ROUTES.FIO_ADDRESS_SIGNATURES}
          component={FioAddressSignaturesPage}
          exact
        />
        <PrivateRoute
          path={ROUTES.FIO_ADDRESS_SIGN}
          component={FioAddressSignPage}
          exact
        />
        <PrivateRoute
          path={ROUTES.FIO_ADDRESSES}
          component={FioAddressManage}
          exact
        />

        <Route
          path={ROUTES.FIO_DOMAIN}
          component={FioDomainLandingPage}
          exact
        />
        <Route
          path={ROUTES.FIO_DOMAINS_SELECTION}
          component={FioDomainSelectionPage}
          exact
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAINS}
          component={FioDomainManagePage}
          exact
        />
        <PrivateRoute path={ROUTES.DASHBOARD} component={DashboardPage} exact />

        <PrivateRoute path={ROUTES.CART} component={CartPage} exact />
        <PrivateRoute path={ROUTES.CHECKOUT} component={CheckoutPage} exact />
        <PrivateRoute path={ROUTES.PURCHASE} component={PurchasePage} exact />
        <PrivateRoute path={ROUTES.TOKENS} component={WalletsPage} exact />
        <PrivateRoute
          path={ROUTES.IMPORT_WALLET}
          component={ImportWalletPage}
          exact
        />
        <PrivateRoute path={ROUTES.FIO_WALLET} component={WalletPage} exact />
        <PrivateRoute
          path={ROUTES.FIO_ADDRESS_OWNERSHIP}
          component={FioAddressTransferPage}
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_OWNERSHIP}
          component={FioDomainTransferPage}
        />

        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_STATUS_CHANGE}
          component={FioDomainStatusChangePage}
        />

        <PrivateRoute
          path={ROUTES.FIO_ADDRESS_ADD_BUNDLES}
          component={FioAddressAddBundlesPage}
        />
        <PrivateRoute
          path={ROUTES.FIO_DOMAIN_RENEW}
          component={FioDomainRenewPage}
        />

        <PrivateRoute
          path={ROUTES.LINK_TOKEN_LIST}
          component={TokenListPage}
          exact
        />
        <PrivateRoute path={ROUTES.DELETE_TOKEN} component={DeleteTokenPage} />
        <PrivateRoute path={ROUTES.ADD_TOKEN} component={AddTokenPage} />
        <PrivateRoute path={ROUTES.EDIT_TOKEN} component={EditTokenPage} />

        <PrivateRoute path={ROUTES.SETTINGS} component={SettingsPage} exact />

        <PrivateRoute path={ROUTES.SEND} component={SendPage} exact />

        <PrivateRoute
          path={ROUTES.FIO_REQUEST}
          component={FioRequestDecryptPage}
          redirectOptions={{ setKeysForAction: true }}
          exact
        />

        <PrivateRoute
          path={ROUTES.FIO_TOKENS_REQUEST}
          component={FioTokensRequestPage}
          exact
        />

        <PrivateRoute
          path={ROUTES.FIO_TOKENS_RECEIVE}
          component={FioTokensReceivePage}
          exact
        />

        <PrivateRoute
          path={ROUTES.FIO_TOKENS_GET}
          component={FioTokensGetPage}
          exact
        />

        <PrivateRoute
          path={ROUTES.PAYMENT_DETAILS}
          component={TokensRequestPaymentPage}
          exact
        />

        <PrivateRoute path={ROUTES.STAKE} component={StakeTokensPage} exact />
        <PrivateRoute
          path={ROUTES.UNSTAKE}
          component={UnstakeTokensPage}
          exact
        />

        <Route
          path={ROUTES.ACCOUNT_RECOVERY}
          component={AccountRecoveryPage}
          exact
        />

        <PrivateRoute
          path={ROUTES.FIO_ADDRESS_NFT_EDIT}
          component={FioAddressNftPage}
        />

        <Route
          path={ROUTES.PRIVACY_POLICY}
          component={PrivacyPolicyPage}
          exact
        />

        <Route
          path={ROUTES.TERMS_OF_SERVICE}
          component={TermsOfServicePage}
          exact
        />

        <Route path={ROUTES.COOKIE_NOTICE} component={CookieNoticePage} exact />

        <Route
          path={ROUTES.NFT_VALIDATION}
          component={NftValidationPage}
          exact
        />

        <PrivateRoute
          path={ROUTES.REJECT_FIO_REQUEST}
          component={RejectFioRequestPage}
          exact
        />

        <PrivateRoute path={ROUTES.ORDERS} component={OrdersPage} exact />
        <PrivateRoute
          path={ROUTES.ORDER_DETAILS}
          component={OrderDetailsPage}
          exact
        />

        <AdminPrivateRoute
          path={ROUTES.ADMIN_HOME}
          component={AdminHomePage}
          exact
        />
        <AdminPrivateRoute
          path={ROUTES.ADMIN_ORDERS}
          component={AdminOrdersPage}
          exact
        />
        <Route path={ROUTES.ADMIN_LOGIN} component={AdminLoginPage} exact />
        <AdminPrivateRoute
          path={ROUTES.ADMIN_USERS}
          component={AdminUserListPage}
          exact
        />
        <Route
          path={ROUTES.ADMIN_CONFIRM_EMAIL}
          component={AdminEmailConfirmPage}
          exact
        />
        <Route
          path={ROUTES.ADMIN_RESET_PASSWORD}
          component={AdminPasswordResetPage}
          exact
        />
        <AdminPrivateRoute
          path={ROUTES.ADMIN_REGULAR_USERS}
          component={AdminRegularUsersList}
          exact
        />
        <AdminPrivateRoute
          path={ROUTES.ADMIN_PROFILE}
          component={AdminProfilePage}
          exact
        />
        <AdminPrivateRoute
          path={ROUTES.ADMIN_ACCOUNTS}
          component={AdminFioAccountsProfilesListPage}
          exact
        />
        <AdminPrivateRoute
          path={ROUTES.ADMIN_SEARCH_RESULT}
          component={AdminSearchResultPage}
          exact
        />

        <AuthContainer />
      </Switch>
    </ScrollToTop>
  </MainLayout>
);

export default Routes;
