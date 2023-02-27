import React from 'react';

import AddressDomainCart from '../../components/AddressDomainCart';
import DoubleCardContainer from '../../components/DoubleCardContainer';
import { FioAddressSelectionComponent } from './components/FioAddressSelectionComponent';

import { LINK_LABELS } from '../../constants/labels';

import { useCheckIfDesktop } from '../../screenType';

import { useContext } from './FioAddressSelectionPageContext';

const FioAddressSelectionPage: React.FC = () => {
  const props = useContext();

  const isDesktop = useCheckIfDesktop();

  return (
    <DoubleCardContainer
      title={LINK_LABELS.FIO_ADDRESSES.toUpperCase()}
      bigCart={
        <FioAddressSelectionComponent isDesktop={isDesktop} {...props} />
      }
      smallCart={isDesktop && <AddressDomainCart />}
    />
  );
};

export default FioAddressSelectionPage;
