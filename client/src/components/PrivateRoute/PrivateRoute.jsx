import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const PrivateRoute = ({
  component: Component,
  noProfileLoaded,
  isNewUser,
  isNewEmailNotVerified,
  loading,
  homePageLink,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
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
                state: { from: props.location },
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
