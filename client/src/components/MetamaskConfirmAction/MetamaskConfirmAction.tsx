import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { MetamaskConnectionModal } from '../Modal/MetamaskConnectionModal';

import { MetamaskSnap } from '../../services/MetamaskSnap';

import { apiUrls as apiUrlsSelector } from '../../redux/registrations/selectors';

import { log } from '../../util/general';
import { decryptContent, signTxn } from '../../util/snap';
import useEffectOnce from '../../hooks/general';

import {
  ActionParams,
  DecryptActionParams,
  FioServerResponse,
} from '../../types/fio';
import { SignedTxArgs } from '../../api/fio';

const canceledRegexp = /transaction canceled|decrypt fio data canceled/i;

export type OnSuccessResponseResult =
  | FioServerResponse
  | FioServerResponse[]
  | SignedTxArgs
  | SignedTxArgs[];

type Props = {
  actionParams: ActionParams | ActionParams[] | DecryptActionParams;
  callSubmitAction?: boolean;
  isDecryptContent?: boolean;
  processing: boolean;
  returnOnlySignedTxn?: boolean;
  onCancel: () => void;
  onSuccess: (result: OnSuccessResponseResult) => void;
  setProcessing: (processing: boolean) => void;
};

export const MetamaskConfirmAction: React.FC<Props> = props => {
  const {
    actionParams,
    callSubmitAction,
    isDecryptContent,
    processing,
    returnOnlySignedTxn,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { state, handleConnectClick } = MetamaskSnap();

  const [hasError, toggleHasError] = useState<boolean>(false);

  const apiUrls = useSelector(apiUrlsSelector);
  const apiUrl = apiUrls[0]?.replace('/v1/', '');

  const submitAction = useCallback(async () => {
    try {
      setProcessing(true);

      if (isDecryptContent && 'content' in actionParams) {
        const decryptedContent = await decryptContent(actionParams);
        onSuccess(decryptedContent);
      }

      const sendActionParams = Array.isArray(actionParams)
        ? actionParams
        : [actionParams];

      const signedTxnsResponse = await signTxn({
        actionParams: sendActionParams,
        apiUrl,
      });

      const signedTxns: {
        successed: SignedTxArgs[];
        failed: { error: string; id: string }[];
      } = JSON.parse(signedTxnsResponse);

      if (
        sendActionParams.length === 1 &&
        !signedTxns.successed.length &&
        signedTxns.failed.length
      ) {
        throw new Error(signedTxns.failed[0].error);
      }

      if (returnOnlySignedTxn) {
        onSuccess(
          signedTxns.successed?.length === 1
            ? signedTxns.successed[0]
            : signedTxns.successed,
        );
      } else {
        const pushTransactionResult = async (
          signedTxn: SignedTxArgs,
        ): Promise<
          | FioServerResponse
          | {
              reason: string;
            }
        > => {
          try {
            const pushResult = await fetch(
              `${apiUrl}/v1/chain/push_transaction`,
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

                throw new Error(
                  `${errorMessage}: ${JSON.stringify(fieldErrors)}`,
                );
              } else if (jsonResult.error && jsonResult.error.what) {
                throw new Error(jsonResult.error.what);
              } else {
                throw new Error(errorMessage);
              }
            }

            const jsonResult = await pushResult.json();
            return jsonResult;
          } catch (error) {
            return {
              reason:
                error instanceof Error ? error.message : 'Something went wrong',
            };
          }
        };

        const results = await Promise.allSettled(
          signedTxns.successed.map(pushTransactionResult),
        );

        const successedResults: FioServerResponse[] = [];

        results.forEach(result => {
          if (result.status === 'fulfilled' && result.value !== null) {
            if ('transaction_id' in result.value) {
              successedResults.push(result.value);
            }
          } else if (result.status === 'rejected') {
            if (typeof result.reason === 'string') {
              log.error(`Transaction failed: ${result.reason}`);
              if (
                signedTxns.successed.length === 1 ||
                canceledRegexp.test(result.reason)
              ) {
                throw new Error(result.reason);
              }
            }
          }
        });

        const res =
          successedResults.length === 1
            ? successedResults[0]
            : successedResults;

        onSuccess(res);
      }
    } catch (error) {
      log.error(error);
      if (canceledRegexp.test(error.message)) {
        onCancel();
      } else {
        toggleHasError(true);
      }
    }
  }, [
    isDecryptContent,
    actionParams,
    apiUrl,
    returnOnlySignedTxn,
    onSuccess,
    onCancel,
    setProcessing,
  ]);

  useEffectOnce(
    () => {
      if (state?.enabled) {
        submitAction();
      }
    },
    [state, submitAction],
    !!state?.enabled,
  );

  useEffectOnce(
    () => {
      if (callSubmitAction && state?.enabled) {
        submitAction();
      }
    },
    [callSubmitAction, state?.enabled, submitAction],
    !!state?.enabled && callSubmitAction,
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
