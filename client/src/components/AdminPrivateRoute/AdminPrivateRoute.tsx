import React from 'react';
import { Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';

import { ADMIN_ROUTES } from '../../constants/routes';
import { SentryRoute } from '../../sentry';

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
    <SentryRoute
      render={(props: RouteComponentProps) => {
        return <Component {...props} />;
      }}
    />
  );
};

export default AdminPrivateRoute;
