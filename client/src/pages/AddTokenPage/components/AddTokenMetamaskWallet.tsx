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
import { AddTokenValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: AddTokenValues;
  onSuccess: (result: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const AddTokenMetamaskWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { name: fioHandle, tokens } = submitData || {};

  const [actionParams, setActionParams] = useState<ActionParams[] | null>(null);

  const handleActionParams = useCallback(() => {
    const actionParamsArr = [];

    const tokensChunks = [];
    const chunkSize = ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION;

    for (let i = 0; i < tokens.length; i += chunkSize) {
      tokensChunks.push(tokens.slice(i, i + chunkSize));
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
        action: Action.addPublicAddresses,
        account: Account.address,
        data: {
          fio_address: fioHandle,
          public_addresses,
          tpid: apis.fio.tpid,
          max_fee: DEFAULT_ACTION_FEE_AMOUNT,
        },
        derivationIndex: fioWallet.data?.derivationIndex,
      };
      actionParamsArr.push(actionParam);
    }

    setActionParams(actionParamsArr);
  }, [fioHandle, fioWallet?.data?.derivationIndex, tokens]);

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
              results.connect.updated.push({
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
          results.connect.updated.push({
            chainCode: chain_code,
            tokenCode: token_code,
            publicAddress: public_address,
          });
        }
      }

      onSuccess(results);
    },
    [onSuccess],
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
      analyticAction={CONFIRM_METAMASK_ACTION.ADD_TOKEN}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleMapPublicAddressResults}
    />
  );
};
