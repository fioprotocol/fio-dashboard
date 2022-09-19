import React from 'react';

import { FioDomainWidget } from '../../components/FioDomainWidget';

import IntegrationSupportSection from './components/IntegrationSupportSection';
import FAQSection from './components/FAQSection';
import HumanReadableMarketingSection from './components/HumanReadableMarketingSection';
import StatsSection from './components/StatsSection';
import WebMarketingSection from './components/WebMarketingSection';
import YourDomainYourControlSection from './components/YourDomainYourControlSection';

import { useContext } from './FioDomainLandingPageContext';

const FioDomainLandingPage: React.FC = () => {
  const { onSubmit } = useContext();

  return (
    <div className="w-100">
      <FioDomainWidget onSubmit={onSubmit} />
      <WebMarketingSection />
      <YourDomainYourControlSection />
      <StatsSection />
      <IntegrationSupportSection />
      <HumanReadableMarketingSection />
      <FAQSection onSubmit={onSubmit} />
    </div>
  );
};

export default FioDomainLandingPage;
