import React from 'react';
import AddressFrom from '../AddressDomainForm';
import AddressDomainBadge from '../AddressDomainBadge/AddressDomainBadge';
import AddressDomainCart from '../AddressDomainCart';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';

import DoubleCardContainer from '../DoubleCardContainer';

const AddressDomainContainer = props => {
  const { title, type, formNameGet } = props;
  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;
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
