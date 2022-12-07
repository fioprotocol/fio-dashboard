import React from 'react';

import { IntroSection } from './components/IntroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FAQSection } from './components/FAQSection';
import { AffiliateModal } from './components/AffiliateModal';
import FioLoader from '../../components/common/FioLoader/FioLoader';

import { useContext } from './FioAffiliateProgramLandingPageContext';

const FioAffiliateProgramLandingPage: React.FC = () => {
  const {
    loading,
    isAuthenticated,
    isAffiliateEnabled,
    showLogin,
    fioAddresses,
    activateAffiliate,
    showModal,
    onOpenModal,
    onCloseModal,
  } = useContext();

  if (loading) {
    return <FioLoader wrap />;
  }

  return (
    <div className="w-100">
      <IntroSection
        isAuthenticated={isAuthenticated}
        isAffiliateEnabled={isAffiliateEnabled}
        showLogin={showLogin}
        showAffiliateModal={onOpenModal}
      />
      <HowItWorksSection
        isAuthenticated={isAuthenticated}
        isAffiliateEnabled={isAffiliateEnabled}
        showLogin={showLogin}
        showAffiliateModal={onOpenModal}
      />
      <FAQSection
        isAuthenticated={isAuthenticated}
        isAffiliateEnabled={isAffiliateEnabled}
        showLogin={showLogin}
        showAffiliateModal={onOpenModal}
      />
      <AffiliateModal
        showModal={showModal}
        onCloseModal={onCloseModal}
        fioAddresses={fioAddresses}
        activateAffiliate={activateAffiliate}
      />
    </div>
  );
};

export default FioAffiliateProgramLandingPage;
