import React from 'react';

import { MetamaskConfirmAction } from '../../../components/MetamaskConfirmAction';
import {
  ACTIONS,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import apis from '../../../api';
import { FioServerResponse } from '../../../types/fio';
import MathOp from '../../../util/math';
import { handleFioServerResponse } from '../../../util/fio';

type Props = {
  derivationIndex: number;
  processing: boolean;
  submitData: {
    chainCode: string;
    fee?: number | null;
    name: string;
    oracleFee?: number | null;
    publicAddress: string;
  };
  startProcessing: boolean;
  onSuccess: (result: {
    fee_collected: number;
    oracle_fee_collected: number;
    transaction_id: string;
  }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const WrapDomainMetamaskWallet: React.FC<Props> = props => {
  const {
    derivationIndex,
    processing,
    startProcessing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { chainCode, fee, name, oracleFee, publicAddress } = submitData;

  const actionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.wrapFioDomain],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioOracle,
    data: {
      fio_domain: name,
      chain_code: chainCode,
      public_address: publicAddress,
      max_oracle_fee: oracleFee,
      tpid: apis.fio.tpid,
      max_fee: new MathOp(fee)
        .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
        .round(0)
        .toNumber(),
    },
    derivationIndex,
  };

  const handleWrapResults = (result: FioServerResponse) => {
    if (!result) return;

    const { fee_collected, oracle_fee_collected } =
      handleFioServerResponse(result) || {};

    onSuccess({
      ...result,
      fee_collected,
      oracle_fee_collected,
      transaction_id: result.transaction_id,
    });
  };

  if (!startProcessing) return null;

  return (
    <MetamaskConfirmAction
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleWrapResults}
    />
  );
};
