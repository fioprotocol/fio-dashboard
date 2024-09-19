import React from 'react';

import { Account, Action } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../MetamaskConfirmAction';

import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { FioWalletDoublet, NFTTokenDoublet } from '../../../types';
import { ActionDataParams } from '../../../types/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: NFTTokenDoublet;
  onSuccess: (result: OnSuccessResponseResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const SignNftMetamaskWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const derivationIndex = fioWallet?.data?.derivationIndex;

  const {
    fioAddress,
    chainCode,
    contractAddress,
    tokenId,
    url,
    hash,
    metadata,
  } = submitData || {};

  const actionParams: {
    action: string;
    account: string;
    data: ActionDataParams;
    derivationIndex: number;
  } = {
    action: Action.addNft,
    account: Account.address,
    data: {
      fio_address: fioAddress,
      nfts: [
        {
          chain_code: chainCode,
          contract_address: contractAddress,
          token_id: tokenId,
          url,
          hash,
          metadata,
        },
      ],
      tpid: apis.fio.tpid,
      max_fee: DEFAULT_ACTION_FEE_AMOUNT,
    },
    derivationIndex,
  };

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.SIGN_NFT}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
};
