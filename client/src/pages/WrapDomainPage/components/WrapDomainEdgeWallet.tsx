import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import MathOp from '../../../util/math';

import {
  ACTIONS,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  TRANSACTION_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
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
  wrapData: WrapDomainValues | null;
  processing: boolean;
  fee?: number | null;
  oracleFee?: number | null;
};

const WrapDomainEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    wrapData,
    fee,
    oracleFee,
    processing,
  } = props;

  const wrap = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(keys, ACTIONS.pushTransaction, {
      action: TRANSACTION_ACTION_NAMES[ACTIONS.wrapFioDomain],
      account: TRANSACTION_ACCOUNT_NAMES[ACTIONS.wrapFioDomain],
      data: {
        fio_domain: data.name,
        chain_code: data.chainCode,
        public_address: data.publicAddress,
        max_oracle_fee: oracleFee,
        max_fee: new MathOp(fee)
          .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
          .round(0)
          .toNumber(),
        tpid: apis.fio.tpid,
      },
    });

    return { ...result };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.WRAP_DOMAIN}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={wrapData}
      submitAction={wrap}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default WrapDomainEdgeWallet;
