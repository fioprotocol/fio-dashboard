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
import { CHAIN_CODES } from '../../../constants/common';
import { ROUTES } from '../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';
import { SOCIAL_MEDIA_CONTAINER_NAMES } from '../../../components/LinkTokenList/constants';

import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';

import apis from '../../../api';
import { handleFioServerResponseActionData } from '../../../util/fio';
import useEffectOnce from '../../../hooks/general';

import { ActionParams } from '../../../types/fio';
import { FioWalletDoublet, LinkActionResult } from '../../../types';
import { EditSocialLinkItem } from '../types';

type Props = {
  fioHandle: string;
  fioWallet: FioWalletDoublet;
  processing: boolean;
  socialMediaLinksList: EditSocialLinkItem[];
  submitData: boolean | null;
  onSuccess: (result: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  setResultsData: (
    results: LinkActionResult & {
      disconnect: { updated: EditSocialLinkItem[] };
    },
  ) => void;
  setSubmitData: (submitData: boolean | null) => void;
};

export const EditSocialMediaLinksMetamaskWallet: React.FC<Props> = props => {
  const {
    fioHandle,
    fioWallet,
    processing,
    socialMediaLinksList,
    submitData,
    onCancel,
    onSuccess,
    setSubmitData,
    setProcessing,
    setResultsData,
  } = props;

  const editedSocialLinks = socialMediaLinksList.filter(
    socialMediaLink => socialMediaLink.newUsername,
  );

  const history = useHistory();

  const [actionParams, setActionParams] = useState<ActionParams[] | null>(null);

  const handleActionParams = useCallback(() => {
    const actionParamsArr = [];

    const tokens = editedSocialLinks.map(socialMediaLinkItem => ({
      ...socialMediaLinkItem,
      chainCode: CHAIN_CODES.SOCIALS,
      tokenCode: socialMediaLinkItem.tokenName.toUpperCase(),
      publicAddress: socialMediaLinkItem.newUsername,
    }));

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
  }, [editedSocialLinks, fioHandle, fioWallet.data?.derivationIndex]);

  const handleMapPublicAddressResults = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      const results: LinkActionResult & {
        disconnect: { updated: EditSocialLinkItem[] };
      } = {
        connect: {
          error: null,
          failed: [],
          updated: [],
        },
        disconnect: {
          error: null,
          failed: [],
          updated: editedSocialLinks as any,
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

      history.push({
        pathname: ROUTES.FIO_SOCIAL_MEDIA_LINKS,
        search: `${QUERY_PARAMS_NAMES.FIO_HANDLE}=${fioHandle}`,
        state: {
          actionType: SOCIAL_MEDIA_CONTAINER_NAMES.EDIT_SOCIAL_MEDIA,
        },
      });
    },
    [
      editedSocialLinks,
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
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleMapPublicAddressResults}
    />
  );
};