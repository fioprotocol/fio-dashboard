import React from 'react';

import { Redirect, RouteComponentProps } from 'react-router-dom';
import { FioAddressDoublet, RefProfile, SignNFTParams } from '../../types';
import SignNft from '../../components/SignNft';

type MatchParams = {
  refProfileCode: string;
};

type Props = {
  isAuthenticated: boolean;
  loading: boolean;
  edgeAuthLoading: boolean;
  refProfileInfo: RefProfile;
  refProfileQueryParams: SignNFTParams;
  fioAddresses: FioAddressDoublet[];
  homePageLink: string;
};

export const RefSignNftPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const {
    refProfileQueryParams,
    isAuthenticated,
    fioAddresses,
    homePageLink,
  } = props;

  if (!isAuthenticated || !fioAddresses.length) {
    return <Redirect to={homePageLink} />;
  }

  return (
    <SignNft
      initialValues={{
        ...refProfileQueryParams,
        creator_url: refProfileQueryParams.metadata.creator_url,
      }}
      fioAddressName={fioAddresses[0].name}
    />
  );
};
