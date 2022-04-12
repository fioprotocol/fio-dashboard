import React from 'react';

import AddressDomainContainer from '../../components/AddressDomainContainer';

import { LINK_LABELS } from '../../constants/labels';
import { useNonActiveUserRedirect } from '../../util/hooks';

import { ADDRESS } from '../../constants/common';

const FioAddressPage: React.FC = () => {
  useNonActiveUserRedirect();
  return (
    <AddressDomainContainer
      title={LINK_LABELS.FIO_ADDRESSES.toUpperCase()}
      type={ADDRESS}
    />
  );
};

export default FioAddressPage;
