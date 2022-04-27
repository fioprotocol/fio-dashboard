import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import SignNft from '../../components/SignNft';
import FioLoader from '../../components/common/FioLoader/FioLoader';

import { useFioAddresses } from '../../util/hooks';

import { FioWalletDoublet, RefProfile, SignNFTParams } from '../../types';

type MatchParams = {
  refProfileCode: string;
};

type Props = {
  isAuthenticated: boolean;
  loading: boolean;
  edgeAuthLoading: boolean;
  refProfileInfo: RefProfile;
  refProfileQueryParams: SignNFTParams;
  fioWallets: FioWalletDoublet[];
  homePageLink: string;
};

export const RefSignNftPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { refProfileQueryParams, isAuthenticated, homePageLink } = props;

  const [fioAddresses] = useFioAddresses();

  if (!isAuthenticated || !fioAddresses.length) {
    return <FioLoader wrap={true} />;
  }

  if (refProfileQueryParams == null) {
    return <Redirect to={homePageLink} />;
  }

  return (
    <SignNft
      initialValues={{
        creatorUrl: refProfileQueryParams.metadata.creatorUrl,
        ...refProfileQueryParams,
      }}
      fioAddressName={fioAddresses[0].name}
    />
  );
};
