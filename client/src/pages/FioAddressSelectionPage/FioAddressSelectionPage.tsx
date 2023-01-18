import React from 'react';

import AddressDomainCart from '../../components/AddressDomainCart';
import DoubleCardContainer from '../../components/DoubleCardContainer';
import { FioAddressSelectionComponent } from './components/FioAddressSelectionComponent';

import { LINK_LABELS } from '../../constants/labels';

import { useCheckIfDesktop } from '../../screenType';
import { useNonActiveUserRedirect } from '../../util/hooks';

const FioAddressSelectionPage: React.FC = () => {
  useNonActiveUserRedirect();

  const isDesktop = useCheckIfDesktop();

  return (
    <DoubleCardContainer
      title={LINK_LABELS.FIO_ADDRESSES.toUpperCase()}
      bigCart={<FioAddressSelectionComponent isDesktop={isDesktop} />}
      smallCart={isDesktop && <AddressDomainCart />}
    />
  );
};

export default FioAddressSelectionPage;
