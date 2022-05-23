import React from 'react';
import { Redirect } from 'react-router-dom';

import SignNft from '../../components/SignNft';
import FioLoader from '../../components/common/FioLoader/FioLoader';

import { useFioAddresses } from '../../util/hooks';

import { ROUTES } from '../../constants/routes';

import { SignNFTParams } from '../../types';

type Props = {
  isAuthenticated: boolean;
  containedFlowQueryParams: SignNFTParams;
};

export const RefSignNftPage: React.FC<Props> = props => {
  const { containedFlowQueryParams, isAuthenticated } = props;

  const [fioAddresses] = useFioAddresses();

  if (!isAuthenticated || !fioAddresses.length) {
    return <FioLoader wrap={true} />;
  }

  if (containedFlowQueryParams == null) {
    return <Redirect to={ROUTES.HOME} />;
  }

  return (
    <SignNft
      initialValues={{
        creatorUrl: containedFlowQueryParams.metadata.creatorUrl,
        ...containedFlowQueryParams,
      }}
      fioAddressName={fioAddresses[0].name}
    />
  );
};
