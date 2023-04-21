import React from 'react';

import MainHeader from '../../components/MainHeader';
import Notifications from '../../components/Notifications';
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
import TxHistoryService from '../../services/TxHistory';
import WalletsDataFlow from '../../services/WalletsDataFlow';
import ContainedFlow from '../../services/ContainedFlow';
import PageTitle from '../../components/PageTitle/PageTitle';
import { ContentContainer } from '../../components/ContentContainer';
import { MainLayoutContainer } from '../../components/MainLayoutContainer';
import FioLoader from '../../components/common/FioLoader/FioLoader';

import { ROUTES } from '../../constants/routes';
import { LINKS } from '../../constants/labels';

import useEffectOnce from '../../hooks/general';
import { getObjKeyByValue } from '../../utils';
import { useGTMGlobalTags } from '../../hooks/googleTagManager';
import apis from '../../api';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  pathname: string;
  isAuthenticated: boolean;
  isActiveUser: boolean;
  loginSuccess: boolean;
  showLogin: boolean;
  showRecovery: boolean;
  edgeContextSet: boolean;
  loadProfile: () => void;
  edgeContextInit: () => void;
  isContainedFlow: boolean;
  init: () => void;
  showRecoveryModal: () => void;
  apiUrls: string[];
  getApiUrls: () => void;
  isMaintenance?: boolean;
  isLoading?: boolean;
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
    loadProfile,
    edgeContextInit,
    isContainedFlow,
    apiUrls,
    getApiUrls,
    isMaintenance,
    isLoading,
  } = props;

  const isDesktop = useCheckIfDesktop();
  const routeName = getObjKeyByValue(ROUTES, pathname);

  useGTMGlobalTags();

  useEffectOnce(() => {
    edgeContextInit();
    loadProfile();
    getApiUrls();
  }, [edgeContextInit, loadProfile, getApiUrls]);

  useEffectOnce(
    () => {
      apis.fio.setApiUrls(apiUrls);
    },
    [apiUrls],
    apiUrls?.length !== 0,
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
      {isLoading ? (
        <>
          <MainHeader isMaintenance />
          <ContentContainer>
            <FioLoader wrap />
          </ContentContainer>
          <Footer />
        </>
      ) : isMaintenance ? (
        <>
          {routeName && <PageTitle link={LINKS.UNAVAILABLE} />}
          <MainHeader isMaintenance />
          <ContentContainer>{children}</ContentContainer>
          <Footer isMaintenance />
        </>
      ) : (
        <>
          {routeName && (
            <PageTitle
              link={LINKS[routeName]}
              noAppName={routeName === LINKS.TWITTER_HANDLE}
            />
          )}
          <MainHeader />
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
