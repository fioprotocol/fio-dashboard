import React from 'react';

import { Helmet } from 'react-helmet-async';

import { MainLayoutContainer } from '../../../components/MainLayoutContainer';
import { FindFioHandleSection } from './components/FindFioHandleSection';
import { FCHSpecialBanners } from './components/FCHSpecialBanners';
import { FioPartnersSlider } from './components/FioPartnersSlider';
import { FioIdFooter } from './components/FioIdFooter';
import { FCHProfileSection } from './components/FCHProfileSection';

import { useContext } from './FioIdLandingPageContext';

const FioIdLandingPage: React.FC = () => {
  const { fch, fioBaseUrl, isDesktop, resetPath, setFch } = useContext();

  return (
    <MainLayoutContainer>
      {fch ? (
        <>
          <Helmet>
            <title>FIO Handle - {fch}</title>
          </Helmet>
          <FCHProfileSection
            fioBaseUrl={fioBaseUrl}
            isDesktop={isDesktop}
            fch={fch}
            resetPath={resetPath}
          />
        </>
      ) : (
        <>
          <FindFioHandleSection
            fioBaseUrl={fioBaseUrl}
            isDesktop={isDesktop}
            setFch={setFch}
          />
        </>
      )}

      <FCHSpecialBanners />
      <FioPartnersSlider />
      <FioIdFooter fioBaseUrl={fioBaseUrl} />
    </MainLayoutContainer>
  );
};

export default FioIdLandingPage;
