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
import ContainedFlowWrapper from '../../components/ContainedFlowWrapper';

import { useCheckIfDesktop } from '../../screenType';
import AutoLogout from '../../services/AutoLogout';
import CartTimeout from '../../services/CartTimeout';
import Ref from '../../services/Ref';
import Roe from '../../services/Roe';
import TxHistoryService from '../../services/TxHistory';
import WalletsDataFlow from '../../services/WalletsDataFlow';
import ContainedFlow from '../../services/ContainedFlow';

import useEffectOnce from '../../hooks/general';
import { useIsAdminRoute } from '../../hooks/admin';

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
  isAdminAuthenticated: boolean;
  loadAdminProfile: () => void;
  loadProfile: () => void;
  edgeContextInit: () => void;
  isContainedFlow: boolean;
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
    isAdminAuthenticated,
    loadAdminProfile,
    loadProfile,
    edgeContextInit,
    isContainedFlow,
  } = props;

  const isDesktop = useCheckIfDesktop();
  const isAdminRoute = useIsAdminRoute();

  useEffectOnce(() => {
    edgeContextInit();
    isAdminRoute ? loadAdminProfile() : loadProfile();
  }, [edgeContextInit, loadAdminProfile, loadProfile, isAdminRoute]);

  const loginFormModalRender = () => showLogin && <LoginForm />;
  const recoveryFormModalRender = () =>
    showRecovery &&
    edgeContextSet &&
    isAuthenticated &&
    isActiveUser && <PasswordRecoveryForm />;

  const isHomePage = pathname === '/';

  return (
    <div className={classes.root}>
      <MainHeader isAdminAuthenticated={isAdminAuthenticated} />
      <CartTimeout />
      <AutoLogout />
      <Ref />
      <Roe />
      <ContainedFlow />
      {isAuthenticated && <WalletsDataFlow />}
      {isAuthenticated && <TxHistoryService />}
      {(isAuthenticated || isAdminAuthenticated) && isDesktop && <Navigation />}
      {(!isHomePage || isAuthenticated) && <Notifications />}
      {isAuthenticated && isDesktop && <Navigation />}
      {(!isHomePage || (isAuthenticated && !isContainedFlow)) && (
        <Notifications />
      )}
      <div className={`${classes.content} ${isHomePage && classes.home}`}>
        <ContainedFlowWrapper isAuthenticated={isAuthenticated}>
          {children}
        </ContainedFlowWrapper>
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
