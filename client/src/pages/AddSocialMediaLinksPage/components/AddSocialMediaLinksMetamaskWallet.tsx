import React, { useCallback, useState } from 'react';

import { useHistory } from 'react-router-dom';

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
import { ROUTES } from '../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';
import { SOCIAL_MEDIA_CONTAINER_NAMES } from '../../../components/LinkTokenList/constants';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { CHAIN_CODES } from '../../../constants/common';

import apis from '../../../api';
import { handleFioServerResponseActionData } from '../../../util/fio';
import useEffectOnce from '../../../hooks/general';

import { ActionParams } from '../../../types/fio';
import {
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
} from '../../../types';
import { FormValues } from '../types';

type Props = {
  fioHandle: string;
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: FormValues;
  onSuccess: (result: LinkActionResult) => void;
  onCancel: () => void;
  setSubmitData: (submitData: FormValues | null) => void;
  setProcessing: (processing: boolean) => void;
  setResultsData: (result: LinkActionResult) => void;
};

export const AddSocialMediaLinksMetamaskWallet: React.FC<Props> = props => {
  const {
    fioHandle,
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setSubmitData,
    setProcessing,
    setResultsData,
  } = props;

  const history = useHistory();

  const [actionParams, setActionParams] = useState<ActionParams[] | null>(null);

  const handleActionParams = useCallback(() => {
    const actionParamsArr = [];

    const tokens: PublicAddressDoublet[] = Object.entries(submitData).map(
      ([key, value]) => {
        let publicAddress = '';
        if (typeof value !== undefined && typeof value === 'string') {
          publicAddress = value;
        }
        return {
          chainCode: CHAIN_CODES.SOCIALS,
          tokenCode: key.toUpperCase(),
          publicAddress: publicAddress,
        };
      },
    );

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
  }, [fioHandle, fioWallet.data?.derivationIndex, submitData]);

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

      if (results) {
        onSuccess(results);
        setResultsData(results);
        setSubmitData(null);

        history.push({
          pathname: ROUTES.FIO_SOCIAL_MEDIA_LINKS,
          search: `${QUERY_PARAMS_NAMES.FIO_HANDLE}=${fioHandle}`,
          state: {
            actionType: SOCIAL_MEDIA_CONTAINER_NAMES.ADD_SOCIAL_MEDIA,
          },
        });
      }
    },
    [fioHandle, history, onSuccess, setResultsData, setSubmitData],
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
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleMapPublicAddressResults}
    />
  );
};
