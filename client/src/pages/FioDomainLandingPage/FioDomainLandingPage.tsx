import React from 'react';

import { FioDomainWidget } from '../../components/FioDomainWidget';
import { DomainsSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';
import { AvailableDomains } from '../../components/AvailableDomains';
import { OpenseaDomains } from '../../components/OpenseaDomains';

import { useContext } from './FioDomainLandingPageContext';

const FioDomainLandingPage: React.FC = () => {
  const { domainPrice, onSubmit } = useContext();

  return (
    <div className="w-100">
      <FioDomainWidget onSubmit={onSubmit} />
      <AvailableDomains domainPrice={domainPrice} onSubmit={onSubmit} />
      <OpenseaDomains />
      <DomainsSpecialsBanner />
      <WidelyAdoptedSection />
      <FioDomainWidget onSubmit={onSubmit} isReverseColors />
    </div>
  );
};

export default FioDomainLandingPage;
