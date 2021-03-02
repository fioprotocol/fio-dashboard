import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Spin } from 'antd';
import LoginPage from '../../pages/LoginPage';
import SignupPage from '../../pages/SignupPage';
import ResetPasswordPage from '../../pages/ResetPasswordPage';
import PasswordRecoveryPage from '../../pages/PasswordRecoveryPage';
import { ROUTES } from '../../constants/routes';
import PropTypes from 'prop-types';
import styles from './AuthContainer.module.scss';

export default class AuthContainer extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  render() {
    const { isAuthenticated, loading } = this.props;
    return (
      <div className={styles.container}>
        {isAuthenticated && !loading && <Redirect to={ROUTES.DASHBOARD} />}
        {loading && (
          <Spin
            size="large"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 2,
            }}
          />
        )}
        {!isAuthenticated && !loading && (
          <Switch>
            <Route path={ROUTES.LOGIN} component={LoginPage} exact />
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
