import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import AddressDomainForm from '../AddressDomainForm';
import AddressDomainBadge from '../AddressDomainBadge/AddressDomainBadge';
import AddressDomainCart from '../AddressDomainCart';
import { useCheckIfDesktop } from '../../screenType';

import DoubleCardContainer from '../DoubleCardContainer';

import { FioNameType, CartItem } from '../../types';
import useEffectOnce from '../../hooks/general';

type Props = {
  title: string;
  type: FioNameType;
  allowCustomDomains: boolean;
  cartItems: CartItem[];
  hasFreeAddress: boolean;
  isContainedFlow: boolean;
  clearOrder: () => void;
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
    isContainedFlow,
    clearOrder,
  } = props;

  const isDesktop = useCheckIfDesktop();

  useEffectOnce(() => clearOrder(), [clearOrder]);

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
          {allowCustomDomains && !isContainedFlow && (
            <AddressDomainBadge type={type} />
          )}
        </>
      }
      smallCart={isDesktop && <AddressDomainCart />}
    />
  );
};

export default withRouter(AddressDomainContainer);
