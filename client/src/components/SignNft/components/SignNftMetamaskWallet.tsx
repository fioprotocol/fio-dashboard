import React from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  ACTIONS,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { NFTTokenDoublet } from '../../../types';
import { ActionDataParams } from '../../../types/fio';

type Props = {
  derivationIndex: number;
  processing: boolean;
  submitData: NFTTokenDoublet;
  startProcessing: boolean;
  onSuccess: (result: OnSuccessResponseResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const SignNftMetamaskWallet: React.FC<Props> = props => {
  const {
    derivationIndex,
    processing,
    startProcessing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

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
    action: TRANSACTION_ACTION_NAMES[ACTIONS.addNft],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
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

  if (!startProcessing) return null;

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
