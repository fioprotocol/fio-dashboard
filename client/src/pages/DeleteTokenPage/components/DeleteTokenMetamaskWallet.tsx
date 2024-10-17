import React, { useCallback, useState } from 'react';

import { Account, Action } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import { ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION } from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';

import apis from '../../../api';
import { handleFioServerResponseActionData } from '../../../util/fio';
import useEffectOnce from '../../../hooks/general';

import { ActionParams } from '../../../types/fio';
import { FioWalletDoublet, LinkActionResult } from '../../../types';
import { CheckedTokenType, DeleteTokenValues } from '../types';

type Props = {
  allowDisconnectAll: boolean;
  fioWallet: FioWalletDoublet;
  processing: boolean;
  checkedPubAddresses: CheckedTokenType[];
  submitData: DeleteTokenValues | null;
  onSuccess: (result: LinkActionResult) => void;
  onCancel: () => void;
  setSubmitData: (submitData: DeleteTokenValues | null) => void;
  setProcessing: (processing: boolean) => void;
  setResultsData: (result: LinkActionResult) => void;
};

export const DeleteTokenMetamaskWallet: React.FC<Props> = props => {
  const {
    allowDisconnectAll,
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setSubmitData,
    setProcessing,
    setResultsData,
  } = props;

  const { fioCryptoHandle, pubAddressesArr } = submitData || {};

  const [actionParams, setActionParams] = useState<ActionParams[] | null>(null);

  const handleActionParams = useCallback(() => {
    const actionParamsArr = [];

    const tokensChunks = [];
    const chunkSize = ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION;

    if (allowDisconnectAll) {
      const actionParam = {
        action: Action.removeAllAddresses,
        account: Account.address,
        data: {
          fio_address: fioCryptoHandle?.name,
          tpid: apis.fio.tpid,
          max_fee: DEFAULT_ACTION_FEE_AMOUNT,
        },
        derivationIndex: fioWallet.data?.derivationIndex,
      };
      actionParamsArr.push(actionParam);
    } else {
      for (let i = 0; i < pubAddressesArr.length; i += chunkSize) {
        tokensChunks.push(pubAddressesArr.slice(i, i + chunkSize));
      }

      for (const tokenChunkItem of tokensChunks) {
        const public_addresses = [];

        for (const tokenItem of tokenChunkItem) {
          const { chainCode, tokenCode, publicAddress } = tokenItem;
          public_addresses.push({
            chain_code: chainCode,
            token_code: tokenCode,
            public_address: publicAddress,
          });
        }

        const actionParam = {
          action: Action.removeAddress,
          account: Account.address,
          data: {
            fio_address: fioCryptoHandle?.name,
            public_addresses,
            tpid: apis.fio.tpid,
            max_fee: DEFAULT_ACTION_FEE_AMOUNT,
          },
          derivationIndex: fioWallet.data?.derivationIndex,
        };
        actionParamsArr.push(actionParam);
      }
    }

    setActionParams(actionParamsArr);
  }, [
    allowDisconnectAll,
    pubAddressesArr,
    fioCryptoHandle,
    fioWallet.data?.derivationIndex,
  ]);

  const handleMapPublicAddressResults = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      const results: LinkActionResult = {
        connect: {
          error: null,
          failed: [],
          updated: [],
        },
        disconnect: {
          error: null,
          failed: [],
          updated: [],
        },
      };

      if (allowDisconnectAll) {
        results.disconnect.updated = pubAddressesArr;
      } else {
        if (Array.isArray(result)) {
          for (const resultItem of result) {
            if ('processed' in resultItem) {
              const { public_addresses } =
                handleFioServerResponseActionData(resultItem) || {};

              for (const publicAddressesItem of public_addresses) {
                const {
                  chain_code,
                  token_code,
                  public_address,
                } = publicAddressesItem;
                results.disconnect.updated.push({
                  chainCode: chain_code,
                  tokenCode: token_code,
                  publicAddress: public_address,
                });
              }
            }
          }
        } else if ('processed' in result) {
          const { public_addresses } =
            handleFioServerResponseActionData(result) || {};

          for (const publicAddressesItem of public_addresses) {
            const {
              chain_code,
              token_code,
              public_address,
            } = publicAddressesItem;
            results.disconnect.updated.push({
              chainCode: chain_code,
              tokenCode: token_code,
              publicAddress: public_address,
            });
          }
        }
      }

      onSuccess(results);
      setResultsData(results);
      setSubmitData(null);
    },
    [
      allowDisconnectAll,
      pubAddressesArr,
      onSuccess,
      setResultsData,
      setSubmitData,
    ],
  );

  useEffectOnce(
    () => {
      if (submitData) {
        handleActionParams();
      }
    },
    [submitData],
    !!submitData,
  );

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.DELETE_TOKEN}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleMapPublicAddressResults}
    />
  );
};
