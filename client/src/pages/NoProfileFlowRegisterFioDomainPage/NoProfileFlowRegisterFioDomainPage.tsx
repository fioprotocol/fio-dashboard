import React from 'react';

import { NoProfileFlowContainer } from '../../components/NoProfileFlowContainer';
import { NoProfileAddressWidget } from '../../components/NoProfileAddressWidget';

import { useContext } from './NoProfileFlowRegisterFioDomainPageContext';

import { RefProfile } from '../../types';

export type Props = {
  refProfile?: RefProfile;
  publicKey?: string;
};

const NoProfileFlowRegisterFioDomain: React.FC<Props> = props => {
  const params = useContext(props);

  return <NoProfileAddressWidget {...params} />;
};

const NoProfileFlowRegisterFioDomainPage: React.FC = () => (
  <NoProfileFlowContainer>
    <NoProfileFlowRegisterFioDomain />
  </NoProfileFlowContainer>
);

export default NoProfileFlowRegisterFioDomainPage;
