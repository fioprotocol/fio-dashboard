import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

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
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import apis from '../../../api';
import { handleFioServerResponseActionData } from '../../../util/fio';
import useEffectOnce from '../../../hooks/general';

import { ActionParams } from '../../../types/fio';
import {
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
} from '../../../types';
import { CheckedSocialMediaLinkType } from '../types';
import { updatePublicAddresses } from '../../../redux/fio/actions';

type Props = {
  allowDisconnectAll: boolean;
  fioHandle: string;
  fioWallet: FioWalletDoublet;
  processing: boolean;
  checkedSocialMediaLinks: CheckedSocialMediaLinkType[];
  submitData: {
    fch: string;
    socialMediaLinksList: CheckedSocialMediaLinkType[] | PublicAddressDoublet[];
  } | null;
  onSuccess: (result: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  setResultsData: (result: LinkActionResult) => void;
  setSubmitData: (
    submitData: {
      fch: string;
      socialMediaLinksList:
        | CheckedSocialMediaLinkType[]
        | PublicAddressDoublet[];
    } | null,
  ) => void;
};

export const DeleteSocialMediaLinkMetamaskWallet: React.FC<Props> = props => {
  const {
    allowDisconnectAll,
    checkedSocialMediaLinks,
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
  const dispatch = useDispatch();

  const [actionParams, setActionParams] = useState<ActionParams[] | null>(null);

  const handleActionParams = useCallback(() => {
    const actionParamsArr = [];

    const tokensChunks = [];
    const chunkSize = ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION;

    if (allowDisconnectAll) {
      const actionParam = {
        action: TRANSACTION_ACTION_NAMES[ACTIONS.removeAllPublicAddresses],
        account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
        data: {
          fio_address: fioHandle,
          tpid: apis.fio.tpid,
          max_fee: DEFAULT_ACTION_FEE_AMOUNT,
        },
        derivationIndex: fioWallet.data?.derivationIndex,
      };
      actionParamsArr.push(actionParam);
    } else {
      for (let i = 0; i < checkedSocialMediaLinks.length; i += chunkSize) {
        tokensChunks.push(checkedSocialMediaLinks.slice(i, i + chunkSize));
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
          action: TRANSACTION_ACTION_NAMES[ACTIONS.removePublicAddresses],
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
    }

    setActionParams(actionParamsArr);
  }, [
    allowDisconnectAll,
    checkedSocialMediaLinks,
    fioHandle,
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
        results.disconnect.updated = checkedSocialMediaLinks;
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

      dispatch(
        updatePublicAddresses(fioHandle, {
          addPublicAddresses: [],
          deletePublicAddresses: checkedSocialMediaLinks,
        }),
      );

      history.push({
        pathname: ROUTES.FIO_SOCIAL_MEDIA_LINKS,
        search: `${QUERY_PARAMS_NAMES.FIO_HANDLE}=${fioHandle}`,
        state: {
          actionType: SOCIAL_MEDIA_CONTAINER_NAMES.DELETE_SOCIAL_MEDIA,
        },
      });
    },
    [
      allowDisconnectAll,
      checkedSocialMediaLinks,
      dispatch,
      fioHandle,
      history,
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
      analyticAction={CONFIRM_METAMASK_ACTION.DELETE_SOCIAL_MEDIA_LINK}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleMapPublicAddressResults}
    />
  );
};
