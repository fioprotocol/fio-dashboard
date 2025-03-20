import React, { useCallback } from 'react';

import MainHeader from '../MainHeader';
import Navigation from '../Navigation';
import { ContentContainer } from '../../../components/ContentContainer';
import { Notifications } from '../../../components/Notifications';
import Footer from '../../../components/Footer';
import GenericErrorModal from '../../../components/Modal/GenericErrorModal';

import { ADMIN_ROUTES } from '../../../constants/routes';

import { useCheckIfDesktop } from '../../../screenType';

import useEffectOnce from '../../../hooks/general';
import apis from '../../api';

import classes from './AdminContainer.module.scss';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  isAuthenticated: boolean;
  pathname: string;
  loadProfile: () => void;
};

const AdminContainer: React.FC<Props> = props => {
  const { children, isAuthenticated, pathname, loadProfile } = props;

  const isDesktop = useCheckIfDesktop();

  const isAdminConfirmEmailRoute = [
    ADMIN_ROUTES.ADMIN_CONFIRM_EMAIL,
    ADMIN_ROUTES.ADMIN_RESET_PASSWORD,
  ].includes(pathname);

  const getApiUrls = useCallback(async () => {
    const apiUrls = await apis.fioReg.apiUrls();
    apis.fio.setApiUrls(apiUrls);
  }, []);

  useEffectOnce(
    () => {
      loadProfile();
    },
    [loadProfile],
    !isAdminConfirmEmailRoute,
  );

  useEffectOnce(() => {
    getApiUrls();
  }, []);

  return (
    <div className={classes.root}>
      <MainHeader />
      {isAuthenticated && isDesktop && <Navigation />}
      {isAuthenticated && <Notifications />}
      <ContentContainer>{children}</ContentContainer>
      <Footer />
      <GenericErrorModal />
    </div>
  );
};

export default AdminContainer;
