import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import CreateAccount from '../../pages/CreateAccountPage';
import { ROUTES } from '../../constants/routes';

import styles from './AuthContainer.module.scss';

type Props = {
  edgeContextSet: boolean;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContainer: React.FC<Props> = props => {
  const { edgeContextSet, isAuthenticated, loading } = props;
  return (
    <div className={styles.container}>
      {isAuthenticated && !loading && <Redirect to={ROUTES.HOME} />}
      {!edgeContextSet && (
        <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
      )}
      {!isAuthenticated && edgeContextSet && (
        <Switch>
          <Route path={ROUTES.CREATE_ACCOUNT} component={CreateAccount} exact />
        </Switch>
      )}
      <Redirect to="/404" />
    </div>
  );
};

export default AuthContainer;
