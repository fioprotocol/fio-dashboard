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
import { makeEdgeContext, addEdgeCorePlugins, lockEdgeCorePlugins } from "edge-core-js";
import plugins from "edge-currency-accountbased";
import logo from "../../assets/images/logo.png";

export default class AuthContainer extends Component {
  static propTypes = {
    edgeContext: PropTypes.object,
    isAuthenticated: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    setEdgeContext: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { edgeContext } = this.props

    if (!edgeContext) {
      this.makeEdgeContext()
    }
  }

  makeEdgeContext = async () => {
    try {
      const options = { // EdgeUiContextOptions
        assetsPath: '/login-window/index.html',
        vendorImageUrl: logo,
        vendorName: 'FIO'
      }

      const context = await makeEdgeContext({
        apiKey: process.env.REACT_APP_EDGE_LOGIN_API_KEY,
        appId: process.env.REACT_APP_EDGE_LOGIN_API_ID,
        hideKeys: false,
        plugins: { fio: true }
      })
      addEdgeCorePlugins({
        fio: plugins.fio
      })
      lockEdgeCorePlugins()

      this.props.setEdgeContext(context)
      // const cachedUsers = await context.listUsernames()
      // this.setState({ context, cachedUsers })
      // const recq = await context.listRecoveryQuestionChoices()
      // console.log(recq);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { edgeContext, isAuthenticated, loading } = this.props;
    return (
      <div className={styles.container}>
        {isAuthenticated && !loading && <Redirect to={ROUTES.DASHBOARD} />}
        {(loading || !edgeContext) && (
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
        {!isAuthenticated && !loading && edgeContext && (
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
