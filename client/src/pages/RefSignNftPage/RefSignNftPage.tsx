import React from 'react';

import { Redirect, RouteComponentProps } from 'react-router-dom';
import { FioAddressDoublet, RefProfile, RefQuery } from '../../types';
import { ROUTES } from '../../constants/routes';
import SignNft from '../../components/SignNft';

type MatchParams = {
  refProfileCode: string;
};

type Props = {
  isAuthenticated: boolean;
  loading: boolean;
  edgeAuthLoading: boolean;
  refProfileInfo: RefProfile;
  refProfileQueryParams: RefQuery;
  fioAddresses: FioAddressDoublet[];
};

export const RefSignNftPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const { refProfileQueryParams, isAuthenticated, fioAddresses } = props;

  if (!isAuthenticated || !fioAddresses.length) {
    return <Redirect to={ROUTES.REF_HOME_PAGE} />;
  }

  return (
    <SignNft
      initialValues={refProfileQueryParams}
      fioAddressName={fioAddresses[0].name}
    />
  );
};
