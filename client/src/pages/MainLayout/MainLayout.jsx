import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import MainHeader from '../../components/MainHeader';
import Notifications from '../../components/Notifications';
import Navigation from '../../components/Navigation/Navigation';
import Footer from '../../components/Footer/Footer';
import LoginForm from '../../components/LoginForm';
import PinConfirmModal from '../../components/PinConfirmModal';
import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import CartTimeout from '../../services/CartTimeout';

import classes from './MainLayout.module.scss';

const MainLayout = props => {
  const {
    account,
    pathname,
    children,
    edgeContextSet,
    showLogin,
    showRecovery,
    init,
  } = props;

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  useEffect(() => {
    init();
  }, []);

  const loginFormModalRender = () => showLogin && <LoginForm />;
  const recoveryFormModalRender = () =>
    showRecovery && account && <PasswordRecoveryForm />;

  const isHomePage = pathname === '/';

  return (
    <div className={classes.root}>
      <MainHeader />
      <CartTimeout />
      {account && isDesktop && <Navigation />}
      <Notifications />
      <div className={`${classes.content} ${isHomePage && classes.home}`}>
        {children}
      </div>
      <Footer />
      {showLogin && edgeContextSet && loginFormModalRender()}
      {showRecovery && edgeContextSet && recoveryFormModalRender()}
      <PinConfirmModal />
    </div>
  );
};

MainLayout.propTypes = exact({
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

export default MainLayout;
