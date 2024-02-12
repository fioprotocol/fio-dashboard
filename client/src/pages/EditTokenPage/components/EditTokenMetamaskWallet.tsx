import React, { useCallback, useState } from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  ACTIONS,
  ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';

import apis from '../../../api';
import { handleFioServerResponseActionData } from '../../../util/fio';
import useEffectOnce from '../../../hooks/general';

import { ActionParams } from '../../../types/fio';
import { FioWalletDoublet, LinkActionResult } from '../../../types';
import { EditTokenElement } from '../types';

type Props = {
  fioHandle: string;
  fioWallet: FioWalletDoublet;
  processing: boolean;
  pubAddressesArr: EditTokenElement[];
  submitData: boolean | null;
  onSuccess: (result: LinkActionResult) => void;
  onCancel: () => void;
  setSubmitData: (submitData: boolean | null) => void;
  setProcessing: (processing: boolean) => void;
  setResultsData: (result: LinkActionResult) => void;
};

export const EditTokenMetamaskWallet: React.FC<Props> = props => {
  const {
    fioHandle,
    fioWallet,
    processing,
    pubAddressesArr,
    submitData,
    onCancel,
    onSuccess,
    setSubmitData,
    setProcessing,
    setResultsData,
  } = props;

  const editedPubAddresses = pubAddressesArr.filter(
    pubAddress => pubAddress.newPublicAddress,
  );

  const [actionParams, setActionParams] = useState<ActionParams[] | null>(null);

  const handleActionParams = useCallback(() => {
    const actionParamsArr = [];

    const editedPublicAddresses = editedPubAddresses.map(pubAddress => ({
      ...pubAddress,
      publicAddress: pubAddress.newPublicAddress,
    }));

    const tokensChunks = [];
    const chunkSize = ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION;

    for (let i = 0; i < editedPublicAddresses.length; i += chunkSize) {
      tokensChunks.push(editedPublicAddresses.slice(i, i + chunkSize));
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
        action: TRANSACTION_ACTION_NAMES[ACTIONS.addPublicAddresses],
        account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
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
  }, [editedPubAddresses, fioHandle, fioWallet.data?.derivationIndex]);

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
          updated: editedPubAddresses,
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
      setResultsData(results);
      setSubmitData(null);
    },
    [editedPubAddresses, onSuccess, setResultsData, setSubmitData],
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
      analyticAction={CONFIRM_METAMASK_ACTION.EDIT_TOKEN}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleMapPublicAddressResults}
    />
  );
};
