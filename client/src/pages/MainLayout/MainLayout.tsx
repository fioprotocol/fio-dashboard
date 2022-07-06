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
    isContainedFlow,
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
      <Ref />
      <Roe />
      <ContainedFlow />
      {isAuthenticated && <WalletsDataFlow />}
      {isAuthenticated && <TxHistoryService />}
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
