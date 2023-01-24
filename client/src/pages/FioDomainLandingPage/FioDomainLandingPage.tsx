import React from 'react';

import { FioDomainWidget } from '../../components/FioDomainWidget';
import { DomainsSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';
import { AvailableDomains } from '../../components/AvailableDomains';
import { OpenseaDomainsBanner } from '../../components/OpenseaDomainsBanner';

import { useContext } from './FioDomainLandingPageContext';

const FioDomainLandingPage: React.FC = () => {
  const { availableDomains, domainPrice, onSubmit } = useContext();

  return (
    <div className="w-100">
      <FioDomainWidget onSubmit={onSubmit} />
      <AvailableDomains
        domains={availableDomains}
        domainPrice={domainPrice}
        onSubmit={onSubmit}
      />
      <OpenseaDomainsBanner />
      <DomainsSpecialsBanner />
      <WidelyAdoptedSection />
      <FioDomainWidget onSubmit={onSubmit} isReverseColors />
    </div>
  );
};

export default FioDomainLandingPage;
