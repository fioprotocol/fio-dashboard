import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import SignupPage from '../../pages/SignupPage';
import ResetPasswordPage from '../../pages/ResetPasswordPage';
import PasswordRecoveryPage from '../../pages/PasswordRecoveryPage';
import { ROUTES } from '../../constants/routes';
import PropTypes from 'prop-types';
import styles from './AuthContainer.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default class AuthContainer extends Component {
  static propTypes = {
    edgeContextSet: PropTypes.bool,
    isAuthenticated: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  render() {
    const { edgeContextSet, isAuthenticated, loading } = this.props;
    return (
      <div className={styles.container}>
        {isAuthenticated && !loading && <Redirect to={ROUTES.DASHBOARD} />}
        {(loading || !edgeContextSet) && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className={styles.spinner}
          />
        )}
        {!isAuthenticated && !loading && edgeContextSet && (
          <Switch>
            {/*<Route path={ROUTES.SIGNUP} component={SignupPage} exact />*/}
            {/*<Route*/}
            {/*  path={ROUTES.RESET_PASSWORD}*/}
            {/*  component={ResetPasswordPage}*/}
            {/*  exact*/}
            {/*/>*/}
            {/*<Route*/}
            {/*  path={ROUTES.PASSWORD_RECOVERY}*/}
            {/*  component={PasswordRecoveryPage}*/}
            {/*  exact*/}
            {/*/>*/}
          </Switch>
        )}
      </div>
    );
  }
}
