import React from 'react';

import AddressDomainContainer from '../../components/AddressDomainContainer';

import { LINK_LABELS } from '../../constants/labels';
import { DOMAIN } from '../../constants/common';

import { useNonActiveUserRedirect } from '../../util/hooks';

const FioDomainPage: React.FC = () => {
  useNonActiveUserRedirect();
  return (
    <AddressDomainContainer
      title={LINK_LABELS.FIO_DOMAINS.toUpperCase()}
      type={DOMAIN}
    />
  );
};

export default FioDomainPage;
