import React from 'react';
import FioDomainStatusChangeResults from '../../components/FioDomainStatusChange/FioDomainStatusChangeResults';
import { ComponentProps } from '../../components/FioDomainStatusChange/FioDomainStatusChangeResults/types';

const FioDomainStatusChangeResultsPage: React.FC<ComponentProps> = props => {
  return <FioDomainStatusChangeResults {...props} />;
};

export default FioDomainStatusChangeResultsPage;
