import React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';

import { ADMIN_ROUTES } from '../../constants/routes';

type Props = {
  isAdminAuthenticated: boolean;
  adminProfileRefreshed: boolean;
  loading: boolean;
};

const AdminPrivateRoute: React.FC<Props & RouteProps> = props => {
  const {
    component: Component,
    isAdminAuthenticated,
    loading,
    adminProfileRefreshed,
  } = props;

  if (!isAdminAuthenticated && !loading && adminProfileRefreshed)
    return <Redirect to={ADMIN_ROUTES.ADMIN_LOGIN} />;

  return (
    <Route
      render={(props: RouteComponentProps) => {
        return <Component {...props} />;
      }}
    />
  );
};

export default AdminPrivateRoute;
