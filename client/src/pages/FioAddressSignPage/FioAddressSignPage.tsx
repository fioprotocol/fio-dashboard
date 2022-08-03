import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import SignNft from '../../components/SignNft';
import { putParamsToUrl } from '../../utils';
import { ROUTES } from '../../constants/routes';

import { SignNFTParams } from '../../types';

type MatchParams = {
  address: string;
};

const FioAddressSignPage: React.FC<RouteComponentProps<
  MatchParams
>> = props => {
  const {
    match: {
      params: { address },
    },
    location: { state },
  } = props;

  const {
    initialValues: signNftInitialValues,
  }: {
    initialValues?: SignNFTParams;
  } = state || {};

  let initialValues = {};

  if (signNftInitialValues) {
    initialValues = {
      creatorUrl: signNftInitialValues.metadata.creatorUrl,
      ...signNftInitialValues,
    };
  }

  return (
    <>
      <SignNft
        initialValues={initialValues}
        addressSelectOff={address}
        fioAddressName={address}
        backTo={
          address
            ? putParamsToUrl(ROUTES.FIO_ADDRESS_SIGNATURES, { address })
            : null
        }
      />
    </>
  );
};

export default FioAddressSignPage;
