import React from 'react';
import AddressFrom from '../AddressDomainForm';
import AddressDomainBadge from '../AddressDomainBadge/AddressDomainBadge';
import AddressDomainCart from '../AddressDomainCart';
import { useCheckIfDesktop } from '../../screenType';

import DoubleCardContainer from '../DoubleCardContainer';

const AddressDomainContainer = props => {
  const { title, type, formNameGet } = props;
  const isDesktop = useCheckIfDesktop();
  return (
    <DoubleCardContainer
      title={title}
      bigCart={
        <>
          <AddressFrom formNameGet={formNameGet} type={type} />
          {!isDesktop && <AddressDomainCart />}
          <AddressDomainBadge type={type} />
        </>
      }
      smallCart={isDesktop && <AddressDomainCart />}
    />
  );
};

export default AddressDomainContainer;
