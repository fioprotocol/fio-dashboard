import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
  component: Component,
  noProfileLoaded,
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

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
