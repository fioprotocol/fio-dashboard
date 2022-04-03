import { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import CreateAccount from '../../pages/CreateAccountPage';
import { ROUTES } from '../../constants/routes';
import { putParamsToUrl } from '../../utils';

import styles from './AuthContainer.module.scss';

export default class AuthContainer extends Component {
  static propTypes = {
    edgeContextSet: PropTypes.bool,
    isRefFlow: PropTypes.bool,
    refProfileInfo: PropTypes.object,
    isAuthenticated: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  render() {
    const {
      edgeContextSet,
      isRefFlow,
      refProfileInfo,
      isAuthenticated,
      loading,
    } = this.props;
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
            <Route
              path={ROUTES.CREATE_ACCOUNT}
              component={CreateAccount}
              exact
            />
          </Switch>
        )}
      </div>
    );
  }
}
