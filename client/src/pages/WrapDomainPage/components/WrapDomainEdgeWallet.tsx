import React from 'react';

import { Account, Action, GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import { defaultMaxFee } from '../../../util/prices';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { TrxResponse } from '../../../api/fio';

import { FioWalletDoublet } from '../../../types';
import { WrapDomainValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponse) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: WrapDomainValues | null;
  processing: boolean;
  fee?: string | null;
  oracleFee?: string | null;
};

const WrapDomainEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    fee,
    oracleFee,
    processing,
  } = props;

  const wrap = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(
      keys,
      GenericAction.pushTransaction,
      {
        action: Action.wrapDomain,
        account: Account.oracle,
        data: {
          fio_domain: data.name,
          chain_code: data.chainCode,
          public_address: data.publicAddress,
          max_oracle_fee: oracleFee,
          max_fee: defaultMaxFee(fee) as string,
          tpid: apis.fio.tpid,
        },
      },
    );

    return { ...result };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.WRAP_DOMAIN}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={submitData}
      submitAction={wrap}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default WrapDomainEdgeWallet;
