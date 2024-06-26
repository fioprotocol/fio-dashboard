import React from 'react';

import { NoProfileFlowContainer } from '../../components/NoProfileFlowContainer';
import { NoProfileAddressWidget } from '../../components/NoProfileAddressWidget';

import { useContext } from './NoProfileFlowRenewFioHandlePageContext';

import { RefProfile } from '../../types';

export type Props = {
  refProfile?: RefProfile;
  publicKey?: string;
};

const NoProfileFlowRenewFioHandle: React.FC<Props> = props => {
  const params = useContext(props);

  return <NoProfileAddressWidget {...params} />;
};

const NoProfileFlowRenewFioHandlePage: React.FC = () => (
  <NoProfileFlowContainer>
    <NoProfileFlowRenewFioHandle />
  </NoProfileFlowContainer>
);

export default NoProfileFlowRenewFioHandlePage;
