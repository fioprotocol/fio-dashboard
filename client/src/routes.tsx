import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import TwitterPage from './pages/TwitterPage';
import MainLayout from './pages/MainLayout';
import AuthContainer from './components/AuthContainer';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import FioLoader from './components/common/FioLoader/FioLoader';

import { REACT_SNAP_AGENT } from './constants/twitter';
import { ROUTES } from './constants/routes';
import { QUERY_PARAMS_NAMES } from './constants/queryParams';
import useMaintenance from './hooks/useMaintenance';

const DashboardPage = React.lazy(() =>
  import(/* webpackChunkName: 'dashboardPage' */ './pages/DashboardPage'),
);
const FioAddressManagePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressManagePage' */ './pages/FioAddressManagePage'
  ),
);
const FioDomainManagePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainManagePage' */ './pages/FioDomainManagePage'
  ),
);
const CartPage = React.lazy(() =>
  import(/* webpackChunkName: 'cartPage' */ './pages/CartPage'),
);
const CheckoutPage = React.lazy(() =>
  import(/* webpackChunkName: 'checkoutPage' */ './pages/CheckoutPage'),
);
const PurchasePage = React.lazy(() =>
  import(/* webpackChunkName: 'purchasePage' */ './pages/PurchasePage'),
);
const FioAddressTransferPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressTransferPage' */ './pages/FioAddressTransferPage'
  ),
);
const FioDomainTransferPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainTransferPage' */ './pages/FioDomainTransferPage'
  ),
);
const FioDomainStatusChangePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainStatusChangePage' */ './pages/FioDomainStatusChangePage'
  ),
);
const FioAddressAddBundlesPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressAddBundlesPage' */ './pages/FioAddressAddBundlesPage'
  ),
);
const FioDomainRenewPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainRenewPage' */ './pages/FioDomainRenewPage'
  ),
);
const TokenListPage = React.lazy(() =>
  import(/* webpackChunkName: 'tokenListPage' */ './pages/TokenListPage'),
);
const DeleteTokenPage = React.lazy(() =>
  import(/* webpackChunkName: 'deleteTokenPage' */ './pages/DeleteTokenPage'),
);
const AddTokenPage = React.lazy(() =>
  import(/* webpackChunkName: 'addTokenPage' */ './pages/AddTokenPage'),
);
const EditTokenPage = React.lazy(() =>
  import(/* webpackChunkName: 'editTokenPage' */ './pages/EditTokenPage'),
);
const SettingsPage = React.lazy(() =>
  import(/* webpackChunkName: 'settingsPage' */ './pages/SettingsPage'),
);
const RefHomePage = React.lazy(() =>
  import(/* webpackChunkName: 'refHomePage' */ './pages/RefHomePage'),
);
const AccountRecoveryPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'accountRecoveryPage' */ './pages/AccountRecoveryPage'
  ),
);
const FioAddressSignaturesPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressSignaturesPage' */ './pages/FioAddressSignaturesPage'
  ),
);
const FioAddressSignPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressSignPage' */ './pages/FioAddressSignPage'
  ),
);
const FioAddressNftPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressNftPage' */ './pages/FioAddressNftPage'
  ),
);
const FioRequestDecryptPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioRequestDecryptPage' */ './pages/FioRequestDecryptPage'
  ),
);
const FioTokensRequestPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioTokensRequestPage' */ './pages/FioTokensRequestPage'
  ),
);
const FioTokensReceivePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioTokensReceivePage' */ './pages/FioTokensReceivePage'
  ),
);
const FioTokensGetPage = React.lazy(() =>
  import(/* webpackChunkName: 'fioTokensGetPage' */ './pages/FioTokensGetPage'),
);
const TokensRequestPaymentPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'tokensRequestPaymentPage' */ './pages/TokensRequestPaymentPage'
  ),
);
const NftValidationPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'nftValidationPage' */ './pages/NftValidationPage'
  ),
);
const WalletsPage = React.lazy(() =>
  import(/* webpackChunkName: 'walletsPage' */ './pages/WalletsPage'),
);
const WalletPage = React.lazy(() =>
  import(/* webpackChunkName: 'walletPage' */ './pages/WalletPage'),
);
const ImportWalletPage = React.lazy(() =>
  import(/* webpackChunkName: 'importWalletPage' */ './pages/ImportWalletPage'),
);
const SendPage = React.lazy(() =>
  import(/* webpackChunkName: 'sendPage' */ './pages/SendPage'),
);
const CreateAccountSetupPinPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'createAccountSetupPinPage' */ './pages/CreateAccountSetupPinPage'
  ),
);
const StakeTokensPage = React.lazy(() =>
  import(/* webpackChunkName: 'stakeTokensPage' */ './pages/StakeTokensPage'),
);
const UnstakeTokensPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'unstakeTokensPage' */ './pages/UnstakeTokensPage'
  ),
);
const RejectFioRequestPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'rejectFioRequestPage' */ './pages/RejectFioRequestPage'
  ),
);
const CancelFioRequestPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'cancelFioRequestPage' */ './pages/CancelFioRequestPage'
  ),
);
const NotFoundPage = React.lazy(() =>
  import(/* webpackChunkName: 'notFoundPage' */ './pages/NotFoundPage'),
);
const UnavailablePage = React.lazy(() =>
  import(/* webpackChunkName: 'notFoundPage' */ './pages/UnavailablePage'),
);
const OrdersPage = React.lazy(() =>
  import(/* webpackChunkName: 'ordersPage' */ './pages/OrdersPage'),
);
const OrderDetailsPage = React.lazy(() =>
  import(/* webpackChunkName: 'orderDetailsPage' */ './pages/OrderDetailsPage'),
);
const FioDomainLandingPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainLandingPage' */ './pages/FioDomainLandingPage'
  ),
);
const FioAddressSelectionPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressSelectionPage' */ './pages/FioAddressSelectionPage'
  ),
);
const FioAddressCustomSelectionPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressSelectionPage' */ './pages/FioAddressCustomSelectionPage'
  ),
);
const FioDomainSelectionPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainSelectionPage' */ './pages/FioDomainSelectionPage'
  ),
);
const FioAffiliateProgramLandingPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAffiliateProgramLandingPage' */ './pages/FioAffiliateProgramLandingPage'
  ),
);
const FioAffiliateProgramPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'fioAffiliateProgramPage' */ './pages/FioAffiliateProgramPage'
  ),
);
const HomePage = React.lazy(() =>
  import(/* webpackChunkName: 'homePage' */ './pages/HomePage'),
);
const PrivacyPolicyPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'privacyPolicyPage' */ './pages/PrivacyPolicyPage'
  ),
);
const TermsOfServicePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'termsOfServicePage' */ './pages/TermsOfServicePage'
  ),
);
const CookieNoticePage = React.lazy(() =>
  import(/* webpackChunkName: 'cookieNoticePage' */ './pages/CookieNoticePage'),
);

const WrapTokensPage = React.lazy(() =>
  import(/* webpackChunkName: 'WrapTokensPage' */ './pages/WrapTokensPage'),
);

const WrapDomainPage = React.lazy(() =>
  import(/* webpackChunkName: 'WrapDomainPage' */ './pages/WrapDomainPage'),
);

const UnwrapDomainPage = React.lazy(() =>
  import(/* webpackChunkName: 'UnwrapDomainPage' */ './pages/UnwrapDomainPage'),
);

const UnwrapTokensPage = React.lazy(() =>
  import(/* webpackChunkName: 'UnwrapTokensPage' */ './pages/UnwrapTokensPage'),
);

const Routes = (): React.ReactElement => {
  const [isMaintenance, isLoading] = useMaintenance();

  return (
    <MainLayout isMaintenance={isMaintenance} isLoading={isLoading}>
      <ScrollToTop>
        <React.Suspense fallback={<FioLoader wrap />}>
          {isMaintenance ? (
            <>
              {navigator.userAgent !== REACT_SNAP_AGENT && (
                <Switch>
                  <Route
                    path={ROUTES.UNAVAILABLE}
                    component={UnavailablePage}
                    exact
                  />
                  <Route
                    path="*"
                    component={() => <Redirect to={ROUTES.UNAVAILABLE} />}
                  />
                </Switch>
              )}
            </>
          ) : (
            <Switch>
              <Route
                path={ROUTES.FIO_ADDRESS_ADD_BUNDLES_OLD}
                component={(props: RouteComponentProps<{ name?: string }>) => (
                  <Redirect
                    to={`${ROUTES.FIO_ADDRESS_ADD_BUNDLES}?${QUERY_PARAMS_NAMES.NAME}=${props.match.params.name}`}
                  />
                )}
              />
              <Route
                path={ROUTES.FIO_DOMAIN_RENEW_OLD}
                component={(props: RouteComponentProps<{ name?: string }>) => (
                  <Redirect
                    to={`${ROUTES.FIO_DOMAIN_RENEW}?${QUERY_PARAMS_NAMES.NAME}=${props.match.params.name}`}
                  />
                )}
              />
              <Route
                path={ROUTES.FIO_REQUEST_OLD}
                component={(
                  props: RouteComponentProps<{
                    publicKey?: string;
                    id?: string;
                  }>,
                ) => (
                  <Redirect
                    to={`${ROUTES.FIO_REQUEST}?${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${props.match.params.publicKey}&${QUERY_PARAMS_NAMES.FIO_REQUEST_ID}=${props.match.params.id}`}
                  />
                )}
                exact
              />
              <Route
                path={ROUTES.FIO_WALLET_OLD}
                component={(
                  props: RouteComponentProps<{ publicKey?: string }>,
                ) => (
                  <Redirect
                    to={`${ROUTES.FIO_WALLET}?${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${props.match.params.publicKey}`}
                  />
                )}
                exact
              />

              <Route path={ROUTES.HOME} component={HomePage} exact />
              <Route
                path={ROUTES.TWITTER_HANDLE}
                component={TwitterPage}
                exact
              />
              {navigator.userAgent !== REACT_SNAP_AGENT && (
                <Route path={ROUTES.NOT_FOUND} component={NotFoundPage} exact />
              )}
              <Route
                path={ROUTES.UNAVAILABLE}
                component={() => <Redirect to={ROUTES.HOME} />}
                exact
              />
              <Route
                path={ROUTES.REF_PROFILE_HOME}
                component={RefHomePage}
                exact
              />
              <Route
                path={ROUTES.FIO_ADDRESSES_SELECTION}
                component={FioAddressSelectionPage}
                exact
              />
              <Route
                path={ROUTES.FIO_ADDRESSES_CUSTOM_SELECTION}
                component={FioAddressCustomSelectionPage}
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
                component={FioAddressManagePage}
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
              <PrivateRoute
                path={ROUTES.DASHBOARD}
                component={DashboardPage}
                exact
              />

              <PrivateRoute path={ROUTES.CART} component={CartPage} exact />
              <PrivateRoute
                path={ROUTES.CHECKOUT}
                component={CheckoutPage}
                exact
              />
              <PrivateRoute
                path={ROUTES.PURCHASE}
                component={PurchasePage}
                exact
              />
              <PrivateRoute
                path={ROUTES.TOKENS}
                component={WalletsPage}
                exact
              />
              <PrivateRoute
                path={ROUTES.IMPORT_WALLET}
                component={ImportWalletPage}
                exact
              />
              <PrivateRoute
                path={ROUTES.FIO_WALLET}
                component={WalletPage}
                exact
              />
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
              <PrivateRoute
                path={ROUTES.DELETE_TOKEN}
                component={DeleteTokenPage}
              />
              <PrivateRoute path={ROUTES.ADD_TOKEN} component={AddTokenPage} />
              <PrivateRoute
                path={ROUTES.EDIT_TOKEN}
                component={EditTokenPage}
              />

              <PrivateRoute
                path={ROUTES.SETTINGS}
                component={SettingsPage}
                exact
              />

              <PrivateRoute path={ROUTES.SEND} component={SendPage} exact />

              <PrivateRoute
                path={ROUTES.CREATE_ACCOUNT_PIN}
                component={CreateAccountSetupPinPage}
                exact
              />

              <PrivateRoute
                path={ROUTES.WRAP_TOKENS}
                component={WrapTokensPage}
                exact
              />
              <PrivateRoute
                path={ROUTES.WRAP_DOMAIN}
                component={WrapDomainPage}
                exact
              />

              <PrivateRoute
                path={ROUTES.UNWRAP_TOKENS}
                component={UnwrapTokensPage}
                exact
              />
              <PrivateRoute
                path={ROUTES.UNWRAP_DOMAIN}
                component={UnwrapDomainPage}
                exact
              />

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

              <PrivateRoute
                path={ROUTES.STAKE}
                component={StakeTokensPage}
                exact
              />
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

              <Route
                path={ROUTES.COOKIE_NOTICE}
                component={CookieNoticePage}
                exact
              />

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

              <PrivateRoute
                path={ROUTES.CANCEL_FIO_REQUEST}
                component={CancelFioRequestPage}
                exact
              />

              <PrivateRoute path={ROUTES.ORDERS} component={OrdersPage} exact />
              <PrivateRoute
                path={ROUTES.ORDER_DETAILS}
                component={OrderDetailsPage}
                exact
              />

              <Route
                path={ROUTES.FIO_AFFILIATE_PROGRAM_LANDING}
                component={FioAffiliateProgramLandingPage}
                exact
              />
              <PrivateRoute
                path={ROUTES.FIO_AFFILIATE_PROGRAM_ENABLED}
                component={FioAffiliateProgramPage}
                exact
              />

              <AuthContainer />
            </Switch>
          )}
        </React.Suspense>
      </ScrollToTop>
    </MainLayout>
  );
};

export default Routes;
