import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import AdminContainer from './components/AdminContainer';
import MainLayout from './pages/MainLayout';
import ConfirmEmail from './pages/ConfirmEmail';
import AuthContainer from './components/AuthContainer';
import PrivateRoute from './components/PrivateRoute';
import { ROUTES } from './constants/routes';

const Routes = () => (
  <MainLayout>
    <Switch>
      <Route path={ROUTES.HOME} component={HomePage} exact />
      <PrivateRoute path={ROUTES.DASHBOARD} component={DashboardPage} exact />
      <PrivateRoute path={ROUTES.ADMIN} component={AdminContainer} exact />
      <Route path={ROUTES.CONFIRM_EMAIL} component={ConfirmEmail} />
      <AuthContainer />
    </Switch>
  </MainLayout>
);

export default Routes;
