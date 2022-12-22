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
import Ref from '../../services/Ref';
import Roe from '../../services/Roe';
import TxHistoryService from '../../services/TxHistory';
import WalletsDataFlow from '../../services/WalletsDataFlow';
import ContainedFlow from '../../services/ContainedFlow';
import PageTitle from '../../components/PageTitle/PageTitle';
import { ContentContainer } from '../../components/ContentContainer';
import { MainLayoutContainer } from '../../components/MainLayoutContainer';

import { ROUTES } from '../../constants/routes';
import { LINKS } from '../../constants/labels';

import useEffectOnce from '../../hooks/general';
import { useIsAdminRoute } from '../../hooks/admin';
import { getObjKeyByValue } from '../../utils';
import { useGTMGlobalTags } from '../../hooks/googleTagManager';

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
  const isConfirmEmailRoute = [
    ROUTES.CONFIRM_EMAIL,
    ROUTES.CONFIRM_EMAIL_RESULT,
  ].includes(pathname);
  const routeName = getObjKeyByValue(ROUTES, pathname);

  useGTMGlobalTags({ disableLoading: isAdminRoute });

  useEffectOnce(() => {
    edgeContextInit();
    if (isAdminRoute) {
      loadAdminProfile();
    } else {
      loadProfile();
    }
  }, [edgeContextInit, loadAdminProfile, loadProfile, isAdminRoute]);

  const loginFormModalRender = () => showLogin && <LoginForm />;
  const recoveryFormModalRender = () =>
    showRecovery &&
    edgeContextSet &&
    isAuthenticated &&
    !isConfirmEmailRoute &&
    isActiveUser && <PasswordRecoveryForm />;

  const isHomePage = pathname === '/';

  return (
    <MainLayoutContainer>
      {routeName && <PageTitle link={LINKS[routeName]} />}
      <MainHeader isAdminAuthenticated={isAdminAuthenticated} />
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
      <TwoFactorApproveModal />
    </MainLayoutContainer>
  );
};

export default MainLayout;
