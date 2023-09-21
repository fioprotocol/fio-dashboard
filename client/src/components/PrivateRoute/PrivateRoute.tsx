import React from 'react';
import { useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';

import Loader from '../Loader/Loader';

import {
  isAuthenticated as isAuthenticatedSelector,
  loading as loadingSelector,
  noProfileLoaded as noProfileLoadedSelector,
} from '../../redux/profile/selectors';

import { ROUTES } from '../../constants/routes';

type OwnProps = {
  redirectOptions?: {
    setKeysForAction?: boolean;
  };
};

export const PrivateRoute: React.FC<RouteProps & OwnProps> = ({
  component: Component,
  redirectOptions,
  ...rest
}) => {
  const loading = useSelector(loadingSelector);
  const noProfileLoaded = useSelector(noProfileLoadedSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) => {
        if (loading && !isAuthenticated) {
          return <Loader />;
        }
        if (noProfileLoaded)
          return (
            <Redirect
              to={{
                pathname: ROUTES.HOME,
                state: {
                  from: props.location,
                  options: redirectOptions,
                },
              }}
            />
          );

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
