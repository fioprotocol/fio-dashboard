import React from 'react';
import { withRouter } from 'react-router';

import AddressDomainForm from '../AddressDomainForm';
import AddressDomainBadge from '../AddressDomainBadge/AddressDomainBadge';
import AddressDomainCart from '../AddressDomainCart';
import { useCheckIfDesktop } from '../../screenType';

import DoubleCardContainer from '../DoubleCardContainer';

const AddressDomainContainer = props => {
  const {
    title,
    type,
    allowCustomDomains,
    location: { query },
    history,
    cartItems,
    hasFreeAddress,
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
            history={history}
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
