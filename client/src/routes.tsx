import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AdminContainer from './components/AdminContainer';
import MainLayout from './pages/MainLayout';
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
import FioDomainStatusChangePage from './pages/FioDomainStatusChangePage';
import FioAddressAddBundlesPage from './pages/FioAddressAddBundlesPage';
import FioDomainRenewPage from './pages/FioDomainRenewPage';
import TokenListPage from './pages/TokenListPage';
import DeleteTokenPage from './pages/DeleteTokenPage';
import AddTokenPage from './pages/AddTokenPage';
import EditTokenPage from './pages/EditTokenPage';
import SettingsPage from './pages/SettingsPage';
import RefHomePage from './pages/RefHomePage';
import RefSignNftPage from './pages/RefSignNftPage';
import AccountRecoveryPage from './pages/AccountRecoveryPage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import EmailConfirmGatePage from './pages/EmailConfirmGatePage';
import FioAddressSignaturesPage from './pages/FioAddressSignaturesPage';
import FioAddressSignPage from './pages/FioAddressSignPage';
import FioAddressNftPage from './pages/FioAddressNftPage';
import FioRequestDecryptPage from './pages/FioRequestDecryptPage';
import FioTokensRequestPage from './pages/FioTokensRequestPage';
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

import { ROUTES } from './constants/routes';

const LIST_TOKEN_PARENT_ROUTE = `${ROUTES.LINK_TOKEN_LIST}/:id`;

const Routes = (): React.ReactElement => (
  <MainLayout>
    <ScrollToTop>
      <Switch>
        <Route path={ROUTES.HOME} component={HomePage} exact />
        <Route path={ROUTES.REF_PROFILE_HOME} component={RefHomePage} exact />
        <Route path={ROUTES.ADMIN} component={AdminContainer} exact />
        <Route
          path={ROUTES.CONFIRM_EMAIL}
          component={EmailConfirmationPage}
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
          component={FioAddressPage}
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
        <PrivateRoute path={ROUTES.TOKENS} component={WalletsPage} exact />
        <PrivateRoute
          path={ROUTES.IMPORT_WALLET}
          component={ImportWalletPage}
          exact
        />
        <PrivateRoute path={ROUTES.FIO_WALLET} component={WalletPage} exact />
        <PrivateRoute
          path={`${ROUTES.FIO_ADDRESS_OWNERSHIP}/:id`}
          component={FioAddressTransferPage}
        />
        <PrivateRoute
          path={`${ROUTES.FIO_DOMAIN_OWNERSHIP}/:id`}
          component={FioDomainTransferPage}
        />

        <PrivateRoute
          path={`${ROUTES.FIO_DOMAIN_STATUS_CHANGE}/:id`}
          component={FioDomainStatusChangePage}
        />

        <PrivateRoute
          path={`${ROUTES.FIO_ADDRESS_ADD_BUNDLES}/:id`}
          component={FioAddressAddBundlesPage}
        />
        <PrivateRoute
          path={`${ROUTES.FIO_DOMAIN_RENEW}/:id`}
          component={FioDomainRenewPage}
        />

        <PrivateRoute
          path={LIST_TOKEN_PARENT_ROUTE}
          component={TokenListPage}
          exact
        />
        <PrivateRoute
          path={`${LIST_TOKEN_PARENT_ROUTE}${ROUTES.DELETE_TOKEN}`}
          component={DeleteTokenPage}
        />
        <PrivateRoute
          path={`${LIST_TOKEN_PARENT_ROUTE}${ROUTES.ADD_TOKEN}`}
          component={AddTokenPage}
        />
        <PrivateRoute
          path={`${LIST_TOKEN_PARENT_ROUTE}${ROUTES.EDIT_TOKEN}`}
          component={EditTokenPage}
        />

        <PrivateRoute path={ROUTES.SETTINGS} component={SettingsPage} exact />

        <PrivateRoute path={ROUTES.SEND} component={SendPage} exact />

        <PrivateRoute
          path={ROUTES.FIO_REQUEST_DECRYPT}
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

        <PrivateRoute path={ROUTES.REF_SIGN_NFT} component={RefSignNftPage} />

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
          path={ROUTES.NFT_VALIDATION}
          component={NftValidationPage}
          exact
        />

        <PrivateRoute
          path={ROUTES.REJECT_FIO_REQUEST}
          component={RejectFioRequestPage}
          exact
        />

        <AuthContainer />
      </Switch>
    </ScrollToTop>
  </MainLayout>
);

export default Routes;
