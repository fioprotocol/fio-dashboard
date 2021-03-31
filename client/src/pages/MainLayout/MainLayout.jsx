import React, { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import MainHeader from '../../components/MainHeader';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import LoginForm from '../../components/LoginForm';
import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';
import NotificationBadge from '../../components/NotificationBadge';

import classes from './MainLayout.module.scss';

export default class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotificationBadge: true,
    };
  }

  static propTypes = exact({
    children: PropTypes.element,
    pathname: PropTypes.string.isRequired,
    user: PropTypes.object,
    account: PropTypes.object,
    loginSuccess: PropTypes.bool,
    showLogin: PropTypes.bool,
    showRecovery: PropTypes.bool,
    edgeContextSet: PropTypes.bool,

    init: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    showRecoveryModal: PropTypes.func.isRequired,
  });

  componentDidMount() {
    this.props.init();
  }

  loginFormModalRender = () => {
    const { showLogin } = this.props;

    return showLogin && <LoginForm />;
  };

  recoveryFormModalRender = () => {
    const { showRecovery, account } = this.props;

    return showRecovery && account && <PasswordRecoveryForm />;
  };

  onBadgeClose = () => {
    this.setState({ isNotificationBadge: false });
  };

  renderBadge = () => {
    const { showRecoveryModal, account, user } = this.props;
    const { isNotificationBadge } = this.state;

    if (!user) return;

    const { secretSet } = user;

    if (account && isNotificationBadge && user) {
      if (!secretSet) return (
          <NotificationBadge onClose={this.onBadgeClose} arrowAction={showRecoveryModal} type='recovery' warn hasArrow />
        );
      return <NotificationBadge onClose={this.onBadgeClose} type='create' />; 
    }
  };

  render() {
    const {
      account,
      pathname,
      children,
      edgeContextSet,
      showLogin,
      showRecovery,
    } = this.props;
    const isHomePage = pathname === '/';
    
    return (
      <div className={classes.root}>
        <MainHeader />
        {account && <Sidebar />}
        {this.renderBadge()}
        <div className={`${classes.content} ${isHomePage && classes.home}`}>
          {children}
        </div>
        <Footer />
        {showLogin && edgeContextSet && this.loginFormModalRender()}
        {showRecovery && edgeContextSet && this.recoveryFormModalRender()}
      </div>
    );
  }
}
