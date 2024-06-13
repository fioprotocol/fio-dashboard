import React from 'react';

import { NoProfileFlowContainer } from '../../components/NoProfileFlowContainer';
import { NoProfileAddressWidget } from '../../components/NoProfileAddressWidget';

import { useContext } from './NoProfileFlowRegisterFioHandleContext';

import { RefProfile } from '../../types';

export type Props = {
  refProfile?: RefProfile;
  publicKey?: string;
};

const NoProfileFlowRegisterFioHandle: React.FC<Props> = props => {
  const params = useContext(props);

  return <NoProfileAddressWidget {...params} />;
};

const NoProfileFlowRegisterFioHandlePage: React.FC = () => (
  <NoProfileFlowContainer>
    <NoProfileFlowRegisterFioHandle />
  </NoProfileFlowContainer>
);

export default NoProfileFlowRegisterFioHandlePage;
