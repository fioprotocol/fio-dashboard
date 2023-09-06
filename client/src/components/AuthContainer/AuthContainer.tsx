import React from 'react';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';

import Loader from '../Loader/Loader';

import CreateAccount from '../../pages/CreateAccountPage';
import { ROUTES } from '../../constants/routes';

import styles from './AuthContainer.module.scss';

type Props = {
  edgeContextSet: boolean;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContainer: React.FC<Props & RouteComponentProps> = props => {
  const { edgeContextSet, isAuthenticated, loading, location } = props;

  if (isAuthenticated && !loading) {
    return <Redirect to={ROUTES.DASHBOARD} />;
  }
  if (location.pathname !== ROUTES.CREATE_ACCOUNT) {
    return <Redirect to={ROUTES.NOT_FOUND} />;
  }

  return (
    <div className={styles.container}>
      {(loading || !edgeContextSet) && <Loader className={styles.spinner} />}
      {!isAuthenticated && edgeContextSet && (
        <Switch>
          <Route path={ROUTES.CREATE_ACCOUNT} component={CreateAccount} exact />
        </Switch>
      )}
    </div>
  );
};

export default AuthContainer;
