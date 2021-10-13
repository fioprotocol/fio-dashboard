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
      type={ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS}
      formNameGet={FORM_NAMES.ADDRESS}
    />
  );
};

export default FioAddressPage;
