import React from 'react';

import MainHeader from '../MainHeader';
import Navigation from '../Navigation';
import { ContentContainer } from '../../../components/ContentContainer';
import Notifications from '../../../components/Notifications';
import Footer from '../../../components/Footer';
import GenericErrorModal from '../../../components/Modal/GenericErrorModal';

import { useCheckIfDesktop } from '../../../screenType';

import useEffectOnce from '../../../hooks/general';

import classes from './AdminContainer.module.scss';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  isAuthenticated: boolean;
  loadProfile: () => void;
};

const AdminContainer: React.FC<Props> = props => {
  const { children, isAuthenticated, loadProfile } = props;

  const isDesktop = useCheckIfDesktop();

  useEffectOnce(() => {
    loadProfile();
  }, [loadProfile]);

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
