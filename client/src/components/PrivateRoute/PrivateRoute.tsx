import React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ROUTES } from '../../constants/routes';

type PrivateRouteProps = {
  noProfileLoaded: boolean;
  isNewUser: boolean;
  isNewEmailNotVerified: boolean;
  loading: boolean;
  homePageLink: string;
};

type OwnProps = {
  redirectOptions?: {
    setKeysForAction?: boolean;
  };
};

export const PrivateRoute: React.FC<PrivateRouteProps &
  RouteProps &
  OwnProps> = ({
  component: Component,
  noProfileLoaded,
  isNewUser,
  isNewEmailNotVerified,
  loading,
  homePageLink,
  redirectOptions,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) => {
        if (loading) {
          return (
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              style={{
                position: 'absolute',
                top: '50%',
              }}
            />
          );
        }
        if (noProfileLoaded)
          return (
            <Redirect
              to={{
                pathname: homePageLink,
                state: { from: props.location, options: redirectOptions },
              }}
            />
          );

        if (isNewEmailNotVerified) {
          return (
            <Redirect
              to={{
                pathname: ROUTES.NEW_EMAIL_NOT_VERIFIED,
                state: { from: props.location },
              }}
            />
          );
        }

        if (isNewUser) {
          return (
            <Redirect
              to={{
                pathname: ROUTES.IS_NEW_USER,
                state: { from: props.location },
              }}
            />
          );
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
