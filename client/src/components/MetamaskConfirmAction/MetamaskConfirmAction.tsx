import React, { useCallback, useState } from 'react';

import { MetamaskConnectionModal } from '../Modal/MetamaskConnectionModal';

import { MetamaskSnap } from '../../services/MetamaskSnap';

import { log } from '../../util/general';
import { signTxn } from '../../util/snap';
import useEffectOnce from '../../hooks/general';

type Props = {
  actionParams: {
    account: string;
    action: string;
    apiUrl: string;
    derivationIndex: number;
    data: {
      amount?: string;
      bundle_sets?: number;
      chain_code?: string;
      content?: {
        payer_public_address?: string;
        payee_public_address: string;
        amount: string;
        chain_code: string;
        token_code: string;
        status?: string;
        obt_id?: string;
        memo: string | null;
        hash: string | null;
        offline_url: string | null;
      };
      fio_address?: string;
      fio_domain?: string;
      fio_request_id?: string;
      is_public?: number;
      max_fee: number;
      max_oracle_fee?: string;
      nfts?: {
        chain_code: string;
        contract_address: string;
        token_id: string;
        url?: string;
        hash?: string;
        metadata?: string;
      }[];
      new_owner_fio_public_key?: string;
      owner_fio_public_key?: string;
      payer_fio_address?: string;
      payee_fio_address?: string;
      payee_public_key?: string;
      public_addresses?: {
        chain_code: string;
        token_code: string;
        public_address: string;
      }[];
      public_address?: string;
      tpid: string;
    };
  };
  processing: boolean;
  returnOnlySignedTxn?: boolean;
  onCancel: () => void;
  onSuccess: (result: { fee_collected: number }) => void;
  setProcessing: (processing: boolean) => void;
};

export const MetamaskConfirmAction: React.FC<Props> = props => {
  const {
    actionParams,
    processing,
    returnOnlySignedTxn,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { state, handleConnectClick } = MetamaskSnap();

  const [hasError, toggleHasError] = useState<boolean>(false);

  const submitAction = useCallback(async () => {
    try {
      setProcessing(true);

      const signedTxn = await signTxn(actionParams);

      if (returnOnlySignedTxn) {
        onSuccess(signedTxn);
      } else {
        const pushResult = await fetch(
          `${actionParams.apiUrl}/v1/chain/push_transaction`,
          {
            body: JSON.stringify(signedTxn),
            method: 'POST',
          },
        );

        if (
          pushResult.status === 400 ||
          pushResult.status === 403 ||
          pushResult.status === 500
        ) {
          const jsonResult = await pushResult.json();
          const errorMessage = jsonResult.message || 'Something went wrong';

          if (jsonResult.fields) {
            // Handle specific error structure with "fields" array
            const fieldErrors = jsonResult.fields.map((field: any) => ({
              name: field.name,
              value: field.value,
              error: field.error,
            }));

            throw new Error(`${errorMessage}: ${JSON.stringify(fieldErrors)}`);
          } else if (jsonResult.error && jsonResult.error.what) {
            throw new Error(jsonResult.error.what);
          } else {
            throw new Error(errorMessage);
          }
        }

        const jsonResult = await pushResult.json();
        onSuccess(jsonResult);
      }
    } catch (error) {
      log.error(error);
      if (error.message?.toLowerCase().includes('transaction cacneled')) {
        onCancel();
      } else {
        toggleHasError(true);
      }
    }
  }, [setProcessing, actionParams, returnOnlySignedTxn, onSuccess, onCancel]);

  useEffectOnce(
    () => {
      if (state?.enabled) {
        submitAction();
      }
    },
    [state, submitAction],
    !!state?.enabled,
  );

  useEffectOnce(() => {
    handleConnectClick();
  }, []);

  return (
    <MetamaskConnectionModal
      hasError={hasError}
      hasCloseButton={hasError}
      show={processing}
      onClose={onCancel}
    />
  );
};
