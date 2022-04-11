import React from 'react';

import MainHeader from '../../components/MainHeader';
import Notifications from '../../components/Notifications';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import LoginForm from '../../components/LoginForm';
import PinConfirmModal from '../../components/PinConfirmModal';
import GenericErrorModal from '../../components/Modal/GenericErrorModal';
import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';
import TwoFactorApproveModal from '../../components/TwoFactorApproveModal';
import { useCheckIfDesktop } from '../../screenType';
import AutoLogout from '../../services/AutoLogout';
import CartTimeout from '../../services/CartTimeout';
import RefFlow from '../../services/RefFlow';
import Roe from '../../services/Roe';
import TxHistoryService from '../../services/TxHistory';
import WalletsDataFlow from '../../services/WalletsDataFlow';

import useEffectOnce from '../../hooks/general';

import classes from './MainLayout.module.scss';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  pathname: string;
  isAuthenticated: boolean;
  isActiveUser: boolean;
  loginSuccess: boolean;
  showLogin: boolean;
  showRecovery: boolean;
  edgeContextSet: boolean;
  init: () => void;
  showRecoveryModal: () => void;
};

const MainLayout: React.FC<Props> = props => {
  const {
    pathname,
    children,
    edgeContextSet,
    isAuthenticated,
    isActiveUser,
    showLogin,
    showRecovery,
    init,
  } = props;

  const isDesktop = useCheckIfDesktop();

  useEffectOnce(() => {
    init();
  }, [init]);

  const loginFormModalRender = () => showLogin && <LoginForm />;
  const recoveryFormModalRender = () =>
    showRecovery &&
    edgeContextSet &&
    isAuthenticated &&
    isActiveUser && <PasswordRecoveryForm />;

  const isHomePage = pathname === '/';

  return (
    <div className={classes.root}>
      <MainHeader />
      <CartTimeout />
      <AutoLogout />
      <RefFlow />
      <Roe />
      {isAuthenticated && <WalletsDataFlow />}
      {isAuthenticated && <TxHistoryService />}
      {isAuthenticated && isDesktop && <Navigation />}
      {(!isHomePage || isAuthenticated) && <Notifications />}
      <div className={`${classes.content} ${isHomePage && classes.home}`}>
        {children}
      </div>
      <Footer />
      {showLogin && edgeContextSet && loginFormModalRender()}
      {showRecovery && edgeContextSet && recoveryFormModalRender()}
      <PinConfirmModal />
      <GenericErrorModal />
      <TwoFactorApproveModal />
    </div>
  );
};

export default MainLayout;
