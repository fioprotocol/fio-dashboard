import React from 'react';

import { MainLayoutContainer } from '../../../components/MainLayoutContainer';
import { FindFioHandleSection } from './components/FindFioHandleSection';
import { FCHSpecialBanners } from './components/FCHSpecialBanners';

const FioIdLandingPage: React.FC = () => {
  return (
    <MainLayoutContainer>
      <FindFioHandleSection />
      <FCHSpecialBanners />
    </MainLayoutContainer>
  );
};

export default FioIdLandingPage;
