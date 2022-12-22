import React from 'react';

import { ContentContainer } from '../../../../components/ContentContainer';
import Footer from '../../../../components/Footer';
import { MainHeaderContainer } from '../../../../components/MainHeaderContainer';
import { MainLayoutContainer } from '../../../../components/MainLayoutContainer';
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
