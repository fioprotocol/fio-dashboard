import React from 'react';

import AddressDomainContainer from '../../components/AddressDomainContainer';

import { LINK_LABELS } from '../../constants/labels';
import { useNonActiveUserRedirect } from '../../util/hooks';

import { DOMAIN } from '../../constants/common';

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
