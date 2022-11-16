import React from 'react';

import { ContentContainer } from '../../../../pages/MainLayout/components/ContentContainer';
import { MainHeaderContainer } from '../../../../components/MainHeader/components/MainHeaderContainer';
import { MainLayoutContainer } from '../../../../pages/MainLayout/components/MainLayoutContainer';
import Footer from '../../../../components/Footer';
import PageTitle from '../../../../components/PageTitle/PageTitle';

import { useContext } from './WrapStatusContainerContext';

import { LINKS } from '../../../../constants/labels';

export const WrapStatusContainer: React.FC = props => {
  const { routeName } = useContext();

  return (
    <MainLayoutContainer>
      {routeName && <PageTitle link={LINKS[routeName]} />}
      <MainHeaderContainer />
      <ContentContainer>{props.children}</ContentContainer>
      <Footer hideNavLinks />
    </MainLayoutContainer>
  );
};
