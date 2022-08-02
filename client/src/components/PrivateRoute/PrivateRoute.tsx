import React from 'react';
import { useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  loading as loadingSelector,
  noProfileLoaded as noProfileLoadedSelector,
  isNewUser as isNewUserSelector,
  isNewEmailNotVerified as isNewEmailNotVerifiedSelector,
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
  const isNewUser = useSelector(isNewUserSelector);
  const isNewEmailNotVerified = useSelector(isNewEmailNotVerifiedSelector);

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
                pathname: ROUTES.HOME,
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
