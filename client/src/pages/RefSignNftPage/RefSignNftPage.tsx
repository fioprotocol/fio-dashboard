import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import SignNft from '../../components/SignNft';
import FioLoader from '../../components/common/FioLoader/FioLoader';

import { useFioCryptoHandles } from '../../util/hooks';

import {
  FioCryptoHandleDoublet,
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
  fioCryptoHandles: FioCryptoHandleDoublet[];
  fioWallets: FioWalletDoublet[];
  homePageLink: string;
};

export const RefSignNftPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const {
    refProfileQueryParams,
    isAuthenticated,
    fioCryptoHandles,
    homePageLink,
  } = props;

  useFioCryptoHandles();

  if (!isAuthenticated || !fioCryptoHandles.length) {
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
        creatorUrl: refProfileQueryParams.metadata.creatorUrl,
        ...refProfileQueryParams,
      }}
      fioCryptoHandleName={fioCryptoHandles[0].name}
    />
  );
};
