import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import SignNft from '../../components/SignNft';
import { ROUTES } from '../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { SignNFTParams } from '../../types';

type LocationProps = {
  location: {
    query?: {
      address?: string;
    };
  };
};

const FioAddressSignPage: React.FC<RouteComponentProps &
  LocationProps> = props => {
  const {
    location: { state = {}, query: { address } = {} },
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
            ? `${ROUTES.FIO_ADDRESS_SIGNATURES}?${QUERY_PARAMS_NAMES.ADDRESS}=${address}`
            : null
        }
      />
    </>
  );
};

export default FioAddressSignPage;
