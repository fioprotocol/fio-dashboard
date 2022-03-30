import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import SignNft from '../../components/SignNft';
import { putParamsToUrl } from '../../utils';
import { ROUTES } from '../../constants/routes';

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
  } = props;

  return (
    <>
      <SignNft
        addressSelectOff={true}
        fioAddressName={address}
        backTo={putParamsToUrl(ROUTES.FIO_ADDRESS_SIGNATURES, { address })}
      />
    </>
  );
};

export default FioAddressSignPage;
