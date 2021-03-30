import React from 'react';
import { Spin } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  loading,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (loading) {
          return (
            <Spin
              size="large"
              style={{
                position: 'absolute',
                top: '50%',
              }}
            />
          );
        }
        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: ROUTES.HOME,
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
