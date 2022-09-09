import React, { useCallback } from 'react';

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

import { ROUTES } from '../../constants/routes';

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
  const isConfirmEmailRoute = pathname === ROUTES.CONFIRM_EMAIL_RESULT;

  const addGTMGlobalTags = useCallback(() => {
    if (!process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID) {
      return;
    }
    const script = document.createElement('script');
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID}');`;
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.cssText = 'display:none;visibility:hidden';
    noscript.appendChild(iframe);

    document.head.append(
      document.createComment(' Google Tag Manager '),
      script,
      document.createComment(' End Google Tag Manager '),
    );
    document.body.prepend(
      document.createComment(' Google Tag Manager (noscript) '),
      noscript,
      document.createComment(' End Google Tag Manager (noscript) '),
    );
  }, []);

  useEffectOnce(() => {
    edgeContextInit();
    if (isAdminRoute) {
      loadAdminProfile();
    } else {
      loadProfile();
      addGTMGlobalTags();
    }
  }, [
    edgeContextInit,
    loadAdminProfile,
    loadProfile,
    addGTMGlobalTags,
    isAdminRoute,
  ]);

  const loginFormModalRender = () => showLogin && <LoginForm />;
  const recoveryFormModalRender = () =>
    showRecovery &&
    edgeContextSet &&
    isAuthenticated &&
    !isConfirmEmailRoute &&
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
