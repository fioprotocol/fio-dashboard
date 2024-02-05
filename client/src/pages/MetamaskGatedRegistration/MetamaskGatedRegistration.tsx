import React from 'react';

import { FCHBanner } from '../../components/FCHBanner';
import { FCHSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';
import AddressWidget from '../../components/AddressWidget';

import { useContext } from './MetamaskGatedRegistrationContext';

const MetamaskGatedRegistration: React.FC = () => {
  const { addressWidgetContent } = useContext();

  return (
    <div>
      <AddressWidget isDarkWhite {...addressWidgetContent} />
      <FCHBanner fch="bob@metamask" />
      <FCHSpecialsBanner />
      <WidelyAdoptedSection />
      <AddressWidget
        isDarkWhite
        {...{ ...addressWidgetContent, logoSrc: '' }}
        isReverseColors
        isTransparent
      />
    </div>
  );
};

export default MetamaskGatedRegistration;
