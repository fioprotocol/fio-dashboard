import React from 'react';

import { MainLayoutContainer } from '../../../components/MainLayoutContainer';
import { FindFioHandleSection } from './components/FindFioHandleSection';

const FioIdLandingPage: React.FC = () => {
  return (
    <MainLayoutContainer>
      <FindFioHandleSection />
    </MainLayoutContainer>
  );
};

export default FioIdLandingPage;
