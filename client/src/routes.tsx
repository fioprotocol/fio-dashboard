import React, { lazy } from 'react';

import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import MainLayout from './pages/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import FioLoader from './components/common/FioLoader/FioLoader';

import { REACT_SNAP_AGENT } from './constants/twitter';
import { ROUTES } from './constants/routes';
import { QUERY_PARAMS_NAMES } from './constants/queryParams';
import useMaintenance from './hooks/useMaintenance';
import { useGTMGlobalTags } from './hooks/googleTagManager';

const TwitterPage = lazy(() =>
  import(/* webpackChunkName: 'twitterPage' */ './pages/TwitterPage'),
);

const DashboardPage = lazy(() =>
  import(/* webpackChunkName: 'dashboardPage' */ './pages/DashboardPage'),
);
const CreateAccount = lazy(() =>
  import(/* webpackChunkName: 'createAccount' */ './pages/CreateAccountPage'),
);
const FioAddressManagePage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressManagePage' */ './pages/FioAddressManagePage'
  ),
);
const FioDomainManagePage = lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainManagePage' */ './pages/FioDomainManagePage'
  ),
);
const CartPage = lazy(() =>
  import(/* webpackChunkName: 'cartPage' */ './pages/CartPage'),
);
const CheckoutPage = lazy(() =>
  import(/* webpackChunkName: 'checkoutPage' */ './pages/CheckoutPage'),
);
const PurchasePage = lazy(() =>
  import(/* webpackChunkName: 'purchasePage' */ './pages/PurchasePage'),
);
const FioAddressTransferPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressTransferPage' */ './pages/FioAddressTransferPage'
  ),
);
const FioDomainTransferPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainTransferPage' */ './pages/FioDomainTransferPage'
  ),
);
const FioDomainStatusChangePage = lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainStatusChangePage' */ './pages/FioDomainStatusChangePage'
  ),
);
const FioAddressAddBundlesPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressAddBundlesPage' */ './pages/FioAddressAddBundlesPage'
  ),
);
const FioDomainRenewPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainRenewPage' */ './pages/FioDomainRenewPage'
  ),
);
const TokenListPage = lazy(() =>
  import(/* webpackChunkName: 'tokenListPage' */ './pages/TokenListPage'),
);
const DeleteTokenPage = lazy(() =>
  import(/* webpackChunkName: 'deleteTokenPage' */ './pages/DeleteTokenPage'),
);
const AddTokenPage = lazy(() =>
  import(/* webpackChunkName: 'addTokenPage' */ './pages/AddTokenPage'),
);
const EditTokenPage = lazy(() =>
  import(/* webpackChunkName: 'editTokenPage' */ './pages/EditTokenPage'),
);
const SettingsPage = lazy(() =>
  import(/* webpackChunkName: 'settingsPage' */ './pages/SettingsPage'),
);
const RefHomePage = lazy(() =>
  import(/* webpackChunkName: 'refHomePage' */ './pages/RefHomePage'),
);
const AccountRecoveryPage = lazy(() =>
  import(
    /* webpackChunkName: 'accountRecoveryPage' */ './pages/AccountRecoveryPage'
  ),
);
const FioAddressSignaturesPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressSignaturesPage' */ './pages/FioAddressSignaturesPage'
  ),
);
const FioAddressSignPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressSignPage' */ './pages/FioAddressSignPage'
  ),
);
const FioAddressNftPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressNftPage' */ './pages/FioAddressNftPage'
  ),
);
const FioRequestDecryptPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioRequestDecryptPage' */ './pages/FioRequestDecryptPage'
  ),
);
const FioTokensRequestPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioTokensRequestPage' */ './pages/FioTokensRequestPage'
  ),
);
const FioTokensReceivePage = lazy(() =>
  import(
    /* webpackChunkName: 'fioTokensReceivePage' */ './pages/FioTokensReceivePage'
  ),
);
const FioSocialLinksPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioSocialMediaLinksPage' */ './pages/FioSocialMediaLinksPage'
  ),
);
const AddSocialLinksPage = lazy(() =>
  import(
    /* webpackChunkName: 'addSocialMediaLinksPage' */ './pages/AddSocialMediaLinksPage'
  ),
);
const EditSocialLinksPage = lazy(() =>
  import(
    /* webpackChunkName: 'editSocialMediaLinksPage' */ './pages/EditSocialMediaLinksPage'
  ),
);
const DeleteSocialLinksPage = lazy(() =>
  import(
    /* webpackChunkName: 'deleteSocialMediaLinksPage' */ './pages/DeleteSocialMediaLinksPage'
  ),
);
const TokensRequestPaymentPage = lazy(() =>
  import(
    /* webpackChunkName: 'tokensRequestPaymentPage' */ './pages/TokensRequestPaymentPage'
  ),
);
const NftValidationPage = lazy(() =>
  import(
    /* webpackChunkName: 'nftValidationPage' */ './pages/NftValidationPage'
  ),
);
const WalletsPage = lazy(() =>
  import(/* webpackChunkName: 'walletsPage' */ './pages/WalletsPage'),
);
const WalletPage = lazy(() =>
  import(/* webpackChunkName: 'walletPage' */ './pages/WalletPage'),
);
const ImportWalletPage = lazy(() =>
  import(/* webpackChunkName: 'importWalletPage' */ './pages/ImportWalletPage'),
);
const SendPage = lazy(() =>
  import(/* webpackChunkName: 'sendPage' */ './pages/SendPage'),
);
const CreateAccountSetupPinPage = lazy(() =>
  import(
    /* webpackChunkName: 'createAccountSetupPinPage' */ './pages/CreateAccountSetupPinPage'
  ),
);
const StakeTokensPage = lazy(() =>
  import(/* webpackChunkName: 'stakeTokensPage' */ './pages/StakeTokensPage'),
);
const UnstakeTokensPage = lazy(() =>
  import(
    /* webpackChunkName: 'unstakeTokensPage' */ './pages/UnstakeTokensPage'
  ),
);
const RejectFioRequestPage = lazy(() =>
  import(
    /* webpackChunkName: 'rejectFioRequestPage' */ './pages/RejectFioRequestPage'
  ),
);
const CancelFioRequestPage = lazy(() =>
  import(
    /* webpackChunkName: 'cancelFioRequestPage' */ './pages/CancelFioRequestPage'
  ),
);
const NotFoundPage = lazy(() =>
  import(/* webpackChunkName: 'notFoundPage' */ './pages/NotFoundPage'),
);
const UnavailablePage = lazy(() =>
  import(/* webpackChunkName: 'notFoundPage' */ './pages/UnavailablePage'),
);
const OrdersPage = lazy(() =>
  import(/* webpackChunkName: 'ordersPage' */ './pages/OrdersPage'),
);
const OrderDetailsPage = lazy(() =>
  import(/* webpackChunkName: 'orderDetailsPage' */ './pages/OrderDetailsPage'),
);
const FioDomainLandingPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainLandingPage' */ './pages/FioDomainLandingPage'
  ),
);
const FioAddressSelectionPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressSelectionPage' */ './pages/FioAddressSelectionPage'
  ),
);
const FioAddressCustomSelectionPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAddressSelectionPage' */ './pages/FioAddressCustomSelectionPage'
  ),
);
const FioDomainSelectionPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioDomainSelectionPage' */ './pages/FioDomainSelectionPage'
  ),
);
const FioAffiliateProgramLandingPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAffiliateProgramLandingPage' */ './pages/FioAffiliateProgramLandingPage'
  ),
);
const FioAffiliateProgramPage = lazy(() =>
  import(
    /* webpackChunkName: 'fioAffiliateProgramPage' */ './pages/FioAffiliateProgramPage'
  ),
);
const HomePage = lazy(() =>
  import(/* webpackChunkName: 'homePage' */ './pages/HomePage'),
);
const PrivacyPolicyPage = lazy(() =>
  import(
    /* webpackChunkName: 'privacyPolicyPage' */ './pages/PrivacyPolicyPage'
  ),
);
const TermsOfServicePage = lazy(() =>
  import(
    /* webpackChunkName: 'termsOfServicePage' */ './pages/TermsOfServicePage'
  ),
);
const CookieNoticePage = lazy(() =>
  import(/* webpackChunkName: 'cookieNoticePage' */ './pages/CookieNoticePage'),
);

const WrapTokensPage = lazy(() =>
  import(/* webpackChunkName: 'WrapTokensPage' */ './pages/WrapTokensPage'),
);

const WrapDomainPage = lazy(() =>
  import(/* webpackChunkName: 'WrapDomainPage' */ './pages/WrapDomainPage'),
);

const UnwrapDomainPage = lazy(() =>
  import(/* webpackChunkName: 'UnwrapDomainPage' */ './pages/UnwrapDomainPage'),
);

const UnwrapTokensPage = lazy(() =>
  import(/* webpackChunkName: 'UnwrapTokensPage' */ './pages/UnwrapTokensPage'),
);

const MetamaskLandingPage = lazy(() =>
  import(
    /* webpackChunkName: 'MetamaskLandingPage' */ './pages/MetamaskLandingPage'
  ),
);

const MetamaskGatedRegistration = lazy(() =>
  import(
    /* webpackChunkName: 'MetamaskGatedRegistration' */ './pages/MetamaskGatedRegistration'
  ),
);

const NoProfileFlowRegisterFioHandlePage = lazy(() =>
  import(
    /* webpackChunkName: 'NoProfileFlowRegisterFioHandle' */ './pages/NoProfileFlowRegisterFioHandlePage'
  ),
);
const NoProfileFlowRegisterFioDomainPage = lazy(() =>
  import(
    /* webpackChunkName: 'NoProfileFlowRegisterFioDomainPage' */ './pages/NoProfileFlowRegisterFioDomainPage'
  ),
);

const Routes = (): React.ReactElement => {
  const [isMaintenance, isLoading] = useMaintenance();
  useGTMGlobalTags();

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
                path={ROUTES.CREATE_ACCOUNT}
                component={CreateAccount}
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
                path={ROUTES.PAYMENT_DETAILS}
                component={TokensRequestPaymentPage}
                exact
              />

              <PrivateRoute
                path={ROUTES.FIO_SOCIAL_MEDIA_LINKS}
                component={FioSocialLinksPage}
                exact
              />
              <PrivateRoute
                path={ROUTES.FIO_SOCIAL_MEDIA_LINKS_ADD}
                component={AddSocialLinksPage}
                exact
              />
              <PrivateRoute
                path={ROUTES.FIO_SOCIAL_MEDIA_LINKS_EDIT}
                component={EditSocialLinksPage}
                exact
              />
              <PrivateRoute
                path={ROUTES.FIO_SOCIAL_MEDIA_LINKS_DELETE}
                component={DeleteSocialLinksPage}
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

              <Route
                path={ROUTES.METAMASK_LANDING_PAGE}
                component={MetamaskLandingPage}
                exact
              />

              <Route
                path={ROUTES.METAMASK_GATED_REGISTRATION}
                component={MetamaskGatedRegistration}
                exact
              />

              <Route
                path={ROUTES.NO_PROFILE_REGISTER_FIO_HANDLE}
                component={NoProfileFlowRegisterFioHandlePage}
                exact
              />

              <Route
                path={ROUTES.NO_PROFILE_REGISTER_FIO_DOMAIN}
                component={NoProfileFlowRegisterFioDomainPage}
                exact
              />

              <Route path={ROUTES.NOT_FOUND} component={NotFoundPage} />
              <Route
                path="*"
                component={() => <Redirect to={ROUTES.NOT_FOUND} />}
              />
            </Switch>
          )}
        </React.Suspense>
      </ScrollToTop>
    </MainLayout>
  );
};

export default Routes;
