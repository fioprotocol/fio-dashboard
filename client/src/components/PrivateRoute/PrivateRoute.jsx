import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const PrivateRoute = ({
  component: Component,
  noProfileLoaded,
  loading,
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
                pathname: ROUTES.HOME,
                state: { from: props.location },
              }}
            />
          );

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
