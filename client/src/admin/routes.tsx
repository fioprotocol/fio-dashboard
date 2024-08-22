import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import AdminContainer from './components/AdminContainer';
import ScrollToTop from '../components/ScrollToTop';
import AdminPrivateRoute from '../components/AdminPrivateRoute';
import FioLoader from '../components/common/FioLoader/FioLoader';

import { ADMIN_ROUTES } from '../constants/routes';
import { SentryRoute } from '../sentry';

const AdminLoginPage = React.lazy(() =>
  import(/* webpackChunkName: 'adminLoginPage' */ '../pages/AdminLoginPage'),
);
const AdminOrdersPage = React.lazy(() =>
  import(/* webpackChunkName: 'adminOrdersPage' */ '../pages/AdminOrdersPage'),
);
const AdminUserListPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminUserListPage' */ '../pages/AdminUserListPage'
  ),
);
const AdminDefaultsPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminDefaultsPage' */ '../pages/AdminDefaultsPage'
  ),
);
const AdminPasswordResetPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminPasswordResetPage' */ '../pages/AdminPasswordResetPage'
  ),
);
const AdminRegularUsersListPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminRegularUsersListPage' */ '../pages/AdminRegularUsersListPage'
  ),
);
const AdminRegularUserDetailsPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminRegularUserDetailsPage' */ '../pages/AdminRegularUserDetailsPage'
  ),
);
const AdminProfilePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminProfilePage' */ '../pages/AdminProfilePage'
  ),
);
const AdminHomePage = React.lazy(() =>
  import(/* webpackChunkName: 'adminHomePage' */ '../pages/AdminHomePage'),
);
const AdminFioAccountsProfilesListPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminFioAccountsProfilesListPage' */ '../pages/AdminFioAccountsProfilesListPage'
  ),
);
const AdminFioApiUrlsListPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminFioApiUrlsListPage' */ '../pages/AdminFioApiUrlsListPage'
  ),
);
const AdminPartnersListPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminPartnersListPage' */ '../pages/AdminPartnersListPage'
  ),
);
const AdminSearchResultPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminSearchResultPage' */ '../pages/AdminSearchResultPage'
  ),
);
const AdminEmailConfirmPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'adminEmailConfirmPage' */ '../pages/AdminEmailConfirmPage'
  ),
);

const Routes = (): React.ReactElement => (
  <AdminContainer>
    <ScrollToTop>
      <React.Suspense fallback={<FioLoader wrap />}>
        <Switch>
          <SentryRoute
            path={ADMIN_ROUTES.ADMIN_LOGIN}
            component={AdminLoginPage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_HOME}
            component={AdminHomePage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_ORDERS}
            component={AdminOrdersPage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_USERS}
            component={AdminUserListPage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_DEFAULTS}
            component={AdminDefaultsPage}
            exact
          />
          <SentryRoute
            path={ADMIN_ROUTES.ADMIN_CONFIRM_EMAIL}
            component={AdminEmailConfirmPage}
            exact
          />
          <SentryRoute
            path={ADMIN_ROUTES.ADMIN_RESET_PASSWORD}
            component={AdminPasswordResetPage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_REGULAR_USERS}
            component={AdminRegularUsersListPage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_REGULAR_USER_DETAILS}
            component={AdminRegularUserDetailsPage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_PROFILE}
            component={AdminProfilePage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_ACCOUNTS}
            component={AdminFioAccountsProfilesListPage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_API_URLS}
            component={AdminFioApiUrlsListPage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_PARTNERS}
            component={AdminPartnersListPage}
            exact
          />
          <AdminPrivateRoute
            path={ADMIN_ROUTES.ADMIN_SEARCH_RESULT}
            component={AdminSearchResultPage}
            exact
          />
          <Redirect to={ADMIN_ROUTES.ADMIN_HOME} />
        </Switch>
      </React.Suspense>
    </ScrollToTop>
  </AdminContainer>
);

export default Routes;
