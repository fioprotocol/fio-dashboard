import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import AddressDomainForm from '../AddressDomainForm';
import AddressDomainBadge from '../AddressDomainBadge/AddressDomainBadge';
import AddressDomainCart from '../AddressDomainCart';
import { useCheckIfDesktop } from '../../screenType';

import DoubleCardContainer from '../DoubleCardContainer';

import { FioNameType, CartItem } from '../../types';

type Props = {
  title: string;
  type: FioNameType;
  cartItems: CartItem[];
  hasFreeAddress: boolean;
  isContainedFlow: boolean;
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
    location: { query },
    cartItems,
    hasFreeAddress,
    isContainedFlow,
  } = props;

  const isDesktop = useCheckIfDesktop();

  return (
    <DoubleCardContainer
      title={title}
      bigCart={
        <>
          <AddressDomainForm
            type={type}
            initialValues={query}
            cartItems={cartItems}
            hasFreeAddress={hasFreeAddress}
          />
          {!isDesktop && <AddressDomainCart />}
          {!isContainedFlow && <AddressDomainBadge type={type} />}
        </>
      }
      smallCart={isDesktop && <AddressDomainCart />}
    />
  );
};

export default withRouter(AddressDomainContainer);
