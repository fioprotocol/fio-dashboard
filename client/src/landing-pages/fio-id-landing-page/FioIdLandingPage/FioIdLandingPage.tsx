import React from 'react';

import { MainLayoutContainer } from '../../../components/MainLayoutContainer';
import { FindFioHandleSection } from './components/FindFioHandleSection';
import { FCHSpecialBanners } from './components/FCHSpecialBanners';
import { FioPartnersSlider } from './components/FioPartnersSlider';
import { FioIdFooter } from './components/FioIdFooter';

import { useContext } from './FioIdLandingPageContext';

const FioIdLandingPage: React.FC = () => {
  const { fioBaseUrl } = useContext();

  return (
    <MainLayoutContainer>
      <FindFioHandleSection fioBaseUrl={fioBaseUrl} />
      <FCHSpecialBanners />
      <FioPartnersSlider />
      <FioIdFooter fioBaseUrl={fioBaseUrl} />
    </MainLayoutContainer>
  );
};

export default FioIdLandingPage;
