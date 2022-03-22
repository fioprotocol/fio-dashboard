import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import AddressDomainFrom from '../AddressDomainForm';
import AddressDomainBadge from '../AddressDomainBadge/AddressDomainBadge';
import AddressDomainCart from '../AddressDomainCart';
import { useCheckIfDesktop } from '../../screenType';

import DoubleCardContainer from '../DoubleCardContainer';

import { FioNameType, CartItem } from '../../types';

type Props = {
  title: string;
  type: FioNameType;
  allowCustomDomains: boolean;
  cartItems: CartItem[];
  hasFreeAddress: boolean;
};

type LocationQuery = {
  location: {
    query: string;
  };
};

const AddressDomainContainer: React.FC<Props &
  LocationQuery &
  RouteComponentProps> = props => {
  const {
    title,
    type,
    allowCustomDomains,
    location: { query },
    cartItems,
    hasFreeAddress,
  } = props;

  const isDesktop = useCheckIfDesktop();

  return (
    <DoubleCardContainer
      title={title}
      bigCart={
        <>
          <AddressDomainFrom
            type={type}
            initialValues={query}
            cartItems={cartItems}
            hasFreeAddress={hasFreeAddress}
          />
          {!isDesktop && <AddressDomainCart />}
          {allowCustomDomains && <AddressDomainBadge type={type} />}
        </>
      }
      smallCart={isDesktop && <AddressDomainCart />}
    />
  );
};

export default withRouter(AddressDomainContainer);
