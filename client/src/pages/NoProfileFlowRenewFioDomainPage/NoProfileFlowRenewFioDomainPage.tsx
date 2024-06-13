import React from 'react';

import { NoProfileFlowContainer } from '../../components/NoProfileFlowContainer';
import { NoProfileAddressWidget } from '../../components/NoProfileAddressWidget';

import { useContext } from './NoProfileFlowRenewFioDomainPageContext';

import { RefProfile } from '../../types';

export type Props = {
  refProfile?: RefProfile;
  publicKey?: string;
};

const NoProfileFlowRenewFioDomain: React.FC<Props> = props => {
  const params = useContext(props);

  return <NoProfileAddressWidget {...params} />;
};

const NoProfileFlowRenewFioDomainPage: React.FC = () => (
  <NoProfileFlowContainer>
    <NoProfileFlowRenewFioDomain />
  </NoProfileFlowContainer>
);

export default NoProfileFlowRenewFioDomainPage;
