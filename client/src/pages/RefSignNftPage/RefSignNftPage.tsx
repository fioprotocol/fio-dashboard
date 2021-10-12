import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import SignNft from '../../components/SignNft';
import FioLoader from '../../components/common/FioLoader/FioLoader';

import { useFioAddresses } from '../../util/hooks';

import {
  FioAddressDoublet,
  FioWalletDoublet,
  RefProfile,
  SignNFTParams,
} from '../../types';

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
  fioWallets: FioWalletDoublet[];
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

  useFioAddresses();

  if (!isAuthenticated || !fioAddresses.length) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1">
        <FioLoader />
      </div>
    );
  }

  if (refProfileQueryParams == null) {
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
