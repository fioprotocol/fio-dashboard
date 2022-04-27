import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import CreateAccount from '../../pages/CreateAccountPage';
import { ROUTES } from '../../constants/routes';
import { putParamsToUrl } from '../../utils';

import { RefProfile } from '../../types';

import styles from './AuthContainer.module.scss';

type Props = {
  edgeContextSet: boolean;
  isRefFlow: boolean;
  refProfileInfo: RefProfile;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContainer: React.FC<Props> = props => {
  const {
    edgeContextSet,
    isRefFlow,
    refProfileInfo,
    isAuthenticated,
    loading,
  } = props;
  return (
    <div className={styles.container}>
      {isAuthenticated && !loading && (
        <Redirect
          to={
            isRefFlow
              ? putParamsToUrl(ROUTES.REF_PROFILE_HOME, {
                  refProfileCode: refProfileInfo.code,
                })
              : ROUTES.HOME
          }
        />
      )}
      {!edgeContextSet && (
        <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
      )}
      {!isAuthenticated && edgeContextSet && (
        <Switch>
          <Route path={ROUTES.CREATE_ACCOUNT} component={CreateAccount} exact />
        </Switch>
      )}
    </div>
  );
};

export default AuthContainer;
