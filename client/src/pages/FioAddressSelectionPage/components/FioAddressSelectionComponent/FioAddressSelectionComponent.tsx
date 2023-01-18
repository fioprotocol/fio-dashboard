import React from 'react';

import AddressDomainCart from '../../../../components/AddressDomainCart';
import { AddressFormContainer } from '../AddressFormContainer';

import { useContext } from './FioAddessSelectionComponentContext';

type Props = {
  isDesktop: boolean;
};

export const FioAddressSelectionComponent: React.FC<Props> = props => {
  const { isDesktop } = props;
  const { loading, setAddressValue } = useContext();

  return (
    <div>
      <AddressFormContainer
        loading={loading}
        setAddressValue={setAddressValue}
      />
      {!isDesktop && <AddressDomainCart />}
    </div>
  );
};
