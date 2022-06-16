import React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

type Props = {
  isAdminAuthenticated: boolean;
  isAuthUser: boolean;
  loading: boolean;
};

const AdminPrivateRoute: React.FC<Props & RouteProps> = props => {
  const {
    component: Component,
    isAdminAuthenticated,
    isAuthUser,
    loading,
  } = props;
  if (isAuthUser) return <Redirect to={ROUTES.HOME} />;

  if (!isAdminAuthenticated && !loading)
    return <Redirect to={ROUTES.ADMIN_LOGIN} />;

  return (
    <Route
      render={(props: RouteComponentProps) => {
        return <Component {...props} />;
      }}
    />
  );
};

export default AdminPrivateRoute;
