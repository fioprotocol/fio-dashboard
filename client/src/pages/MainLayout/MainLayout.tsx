import React, { useEffect } from 'react';

import MainHeader from '../../components/MainHeader';
import { Notifications } from '../../components/Notifications';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import LoginForm from '../../components/LoginForm';
import PinConfirmModal from '../../components/PinConfirmModal';
import GenericErrorModal from '../../components/Modal/GenericErrorModal';
import GenericSuccessModal from '../../components/Modal/GenericSuccessModal';
import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';
import TwoFactorApproveModal from '../../components/TwoFactorApproveModal';
import ContainedFlowWrapper from '../../components/ContainedFlowWrapper';
import TwitterMeta from '../../components/TwitterMeta/TwitterMeta';

import { useCheckIfDesktop } from '../../screenType';
import AutoLogout from '../../services/AutoLogout';
import Ref from '../../services/Ref';
import Roe from '../../services/Roe';
import PricesCartCheck from '../../services/PricesCartCheck';
import ContainedFlow from '../../services/ContainedFlow';
import PageTitle from '../../components/PageTitle/PageTitle';
import { ContentContainer } from '../../components/ContentContainer';
import { MainLayoutContainer } from '../../components/MainLayoutContainer';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import { NoProfileFlowMainHeader } from '../../components/NoProfileFlowMainHeader';

import { ROUTES } from '../../constants/routes';
import { LINKS } from '../../constants/labels';
import { REACT_SNAP_AGENT } from '../../constants/twitter';

import useEffectOnce from '../../hooks/general';
import { getObjKeyByValue } from '../../utils';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  pathname: string;
  isAuthenticated: boolean;
  profileRefreshed: boolean;
  isActiveUser: boolean;
  isNoProfileFlow: boolean;
  loginSuccess: boolean;
  showLogin: boolean;
  showRecovery: boolean;
  edgeContextSet: boolean;
  refProfileLoading: boolean;
  loadProfile: ({
    shouldHandleUsersFreeCart,
  }: {
    shouldHandleUsersFreeCart: boolean;
  }) => void;
  edgeContextInit: () => void;
  isContainedFlow: boolean;
  init: () => void;
  showRecoveryModal: () => void;
  apiUrls: string[];
  isMaintenance?: boolean;
  isLoading?: boolean;
  getCart: () => void;
  logout: () => void;
  loginGuest: () => void;
  getSiteSettings: () => void;
};

const MainLayout: React.FC<Props> = props => {
  const {
    pathname,
    children,
    edgeContextSet,
    isAuthenticated,
    profileRefreshed,
    isActiveUser,
    isNoProfileFlow,
    refProfileLoading,
    showLogin,
    showRecovery,
    loadProfile,
    edgeContextInit,
    isContainedFlow,
    apiUrls,
    isMaintenance,
    isLoading,
    getCart,
    logout,
    loginGuest,
    getSiteSettings,
  } = props;

  const isDesktop = useCheckIfDesktop();
  const routeName = getObjKeyByValue(ROUTES, pathname);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    loginGuest();
  }, [loginGuest, isAuthenticated]);

  useEffectOnce(
    () => {
      getSiteSettings();
      edgeContextInit();
      loadProfile({ shouldHandleUsersFreeCart: true });
    },
    [edgeContextInit, loadProfile],
    !refProfileLoading,
  );

  useEffectOnce(
    () => {
      getCart();
    },
    [getCart],
    profileRefreshed && !isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated, getCart]);

  useEffectOnce(
    () => {
      logout();
    },
    [isAuthenticated, isNoProfileFlow],
    isAuthenticated && !!isNoProfileFlow,
  );

  const loginFormModalRender = () => showLogin && <LoginForm />;
  const recoveryFormModalRender = () =>
    showRecovery &&
    edgeContextSet &&
    isAuthenticated &&
    isActiveUser && <PasswordRecoveryForm />;

  const isHomePage = pathname === '/';

  return (
    <MainLayoutContainer>
      <TwitterMeta />

      {routeName && navigator.userAgent === REACT_SNAP_AGENT && (
        <PageTitle link={LINKS[routeName]} />
      )}

      {isLoading || (!isMaintenance && !apiUrls.length) ? (
        <>
          <MainHeader isMaintenance />
          <ContentContainer>
            <FioLoader wrap />
          </ContentContainer>
          <Footer />
        </>
      ) : isMaintenance ? (
        <>
          {routeName && navigator.userAgent !== REACT_SNAP_AGENT && (
            <PageTitle link={LINKS.UNAVAILABLE} />
          )}
          <MainHeader isMaintenance />
          <ContentContainer>{children}</ContentContainer>
          <Footer isMaintenance />
        </>
      ) : (
        <>
          {routeName && <PageTitle link={LINKS[routeName]} shouldFireOnce />}
          {isNoProfileFlow ? <NoProfileFlowMainHeader /> : <MainHeader />}
          <AutoLogout />
          <Ref />
          <Roe />
          <PricesCartCheck />
          <ContainedFlow />
          {isAuthenticated && isDesktop && <Navigation />}
          {(!isHomePage || (isAuthenticated && !isContainedFlow)) && (
            <Notifications />
          )}
          <ContentContainer>
            <ContainedFlowWrapper isAuthenticated={isAuthenticated}>
              {children}
            </ContainedFlowWrapper>
          </ContentContainer>
          <Footer />
          {showLogin && edgeContextSet && loginFormModalRender()}
          {showRecovery && edgeContextSet && recoveryFormModalRender()}
          <PinConfirmModal />
          <GenericErrorModal />
          <GenericSuccessModal />
          <TwoFactorApproveModal />
        </>
      )}
    </MainLayoutContainer>
  );
};

export default MainLayout;
