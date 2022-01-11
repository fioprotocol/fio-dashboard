import React from 'react';
import { Redirect } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import SignNft from '../../components/SignNft';

import { ROUTES } from '../../constants/routes';

import { putParamsToUrl } from '../../utils';

import { FioCryptoHandleDoublet, NFTTokenDoublet } from '../../types';

type Props = {
  nft: { address: string; currentNft: NFTTokenDoublet };
  fioCryptoHandles: FioCryptoHandleDoublet[];
};

const FioAddressNftPage: React.FC<Props> = props => {
  const {
    nft: { address, currentNft },
    fioCryptoHandles,
  } = props;
  const { metadata } = currentNft || {};

  const creatorUrl = (() => {
    try {
      return JSON.parse(metadata).creator_url;
    } catch (err) {
      return '';
    }
  })();

  const initialValues = {
    ...currentNft,
    creatorUrl,
  };

  if (!currentNft || !address || isEmpty(fioCryptoHandles))
    return (
      <Redirect
        to={{
          pathname: ROUTES.FIO_ADDRESSES,
        }}
      />
    );
  return (
    <SignNft
      isEdit={true}
      initialValues={initialValues}
      fioCryptoHandleName={address}
      backTo={putParamsToUrl(ROUTES.FIO_ADDRESS_SIGNATURES, {
        address,
      })}
    />
  );
};

export default FioAddressNftPage;
