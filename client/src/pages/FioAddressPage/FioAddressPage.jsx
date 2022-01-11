import React from 'react';
import AddressDomainContainer from '../../components/AddressDomainContainer';

import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import { LINK_LABELS } from '../../constants/labels';
import { FORM_NAMES } from '../../constants/form';
import { useNonActiveUserRedirect } from '../../util/hooks';

const FioAddressPage = () => {
  useNonActiveUserRedirect();
  return (
    <AddressDomainContainer
      title={LINK_LABELS.FIO_ADDRESSES.toUpperCase()}
      type={ADDRESS_DOMAIN_BADGE_TYPE.FIO_CRYPTO_HANDLE}
      formNameGet={FORM_NAMES.FIO_CRYPTO_HANDLE}
    />
  );
};

export default FioAddressPage;
