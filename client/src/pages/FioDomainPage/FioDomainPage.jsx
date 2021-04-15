import React from 'react';
import AddressDomainContainer from '../../components/AddressDomainContainer';

import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import { LINK_LABELS } from '../../constants/labels';

const FioDomainPage = () => {
  return (
    <AddressDomainContainer
      title={LINK_LABELS.FIO_DOMAINS.toUpperCase()}
      type={ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN}
    />
  );
};

export default FioDomainPage;
