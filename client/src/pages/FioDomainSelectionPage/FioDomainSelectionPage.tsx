import React from 'react';

import AddressDomainCart from '../../components/AddressDomainCart';
import DoubleCardContainer from '../../components/DoubleCardContainer';

import { FioDomainSelectionComponent } from './components/FioDomainSelectionComponent/FioDomainSelectionComponent';

import { useContext } from './FioDomainSelectionPageContext';

import { useCheckIfDesktop } from '../../screenType';

const FioDomainSelectionPage: React.FC = () => {
  const props = useContext();

  const isDesktop = useCheckIfDesktop();

  return (
    <DoubleCardContainer
      title="FIO Domain Registration"
      bigCart={<FioDomainSelectionComponent isDesktop={isDesktop} {...props} />}
      smallCart={isDesktop && <AddressDomainCart />}
    />
  );
};

export default FioDomainSelectionPage;
