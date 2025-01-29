import React, { useCallback, useState } from 'react';

import { MetamaskConnectionModal } from '../Modal/MetamaskConnectionModal';

import { MetamaskSnap } from '../../services/MetamaskSnap';

import apis from '../../api';

import {
  fireActionAnalyticsEvent,
  fireActionAnalyticsEventError,
} from '../../util/analytics';
import { log } from '../../util/general';
import { decryptContent, signTxn } from '../../util/snap';
import useEffectOnce from '../../hooks/general';

import {
  CANNOT_TRANSFER_ERROR,
  CANNOT_TRANSFER_ERROR_TITLE,
  CANNOT_UPDATE_FIO_HANDLE,
  CANNOT_UPDATE_FIO_HANDLE_TITLE,
  ERROR_MESSAGE_FOR_DECRYPT_CONTENT,
  TRANSFER_ERROR_BECAUSE_OF_NOT_BURNED_NFTS,
} from '../../constants/errors';
import { ROUTES } from '../../constants/routes';

import {
  ActionParams,
  DecryptActionParams,
  DecryptedItem,
  FioServerResponse,
} from '../../types/fio';
import { SignedTxArgs } from '../../api/fio';
import { AnyType } from '../../types';

const canceledRegexp = /transaction canceled|decrypt fio data canceled/i;

export type OnSuccessResponseResult =
  | FioServerResponse
  | FioServerResponse[]
  | SignedTxArgs
  | SignedTxArgs[]
  | DecryptedItem
  | DecryptedItem[];

type Props = {
  actionParams?:
    | ActionParams
    | ActionParams[]
    | DecryptActionParams
    | DecryptActionParams[];
  analyticAction: string;
  analyticsData: AnyType | null;
  callSubmitAction?: boolean;
  isDecryptContent?: boolean;
  processing: boolean;
  returnOnlySignedTxn?: boolean;
  derivationIndex?: number;
  onCancel: () => void;
  onSuccess: (result: OnSuccessResponseResult) => void;
  handleActionParams?: (
    submitData: AnyType | null,
    derivationIndex?: number,
  ) =>
    | ActionParams
    | ActionParams[]
    | DecryptActionParams
    | DecryptActionParams[];
  setProcessing: (processing: boolean) => void;
};

export const MetamaskConfirmAction: React.FC<Props> = props => {
  const {
    actionParams,
    analyticAction,
    analyticsData,
    callSubmitAction,
    isDecryptContent,
    processing,
    returnOnlySignedTxn,
    derivationIndex,
    onCancel,
    onSuccess,
    setProcessing,
    handleActionParams,
  } = props;

  const { state, handleConnectClick } = MetamaskSnap();

  const [hasError, toggleHasError] = useState<boolean>(false);
  const [errorObj, setErrorObj] = useState<{
    message: string;
    title?: string;
    buttonText?: string;
  }>(null);

  const getApiUrl = async () => {
    const validApiUrls = await apis.fio.checkUrls();
    return validApiUrls[0]?.replace('/v1/', '');
  };

  const submitAction = useCallback(async () => {
    try {
      setProcessing(true);

      let uActionParams = actionParams;
      if (!uActionParams && handleActionParams) {
        uActionParams = handleActionParams(analyticsData, derivationIndex);
      }
      if (isDecryptContent) {
        if (Array.isArray(uActionParams)) {
          const decryptedContents = [];
          for (const actionParamsItem of uActionParams) {
            if ('content' in actionParamsItem) {
              const decryptedData = await decryptContent(actionParamsItem);
              decryptedContents.push({
                decryptedData,
                contentType: actionParamsItem.contentType,
              });
            }
          }
          onSuccess(decryptedContents);
          return;
        }

        if ('content' in uActionParams) {
          const decryptedContent = await decryptContent(uActionParams);
          onSuccess({
            decryptedData: decryptedContent,
            contentType: uActionParams.contentType,
          });
          return;
        }
      }

      const sendActionParams = Array.isArray(uActionParams)
        ? uActionParams
        : [uActionParams];

      const apiUrl = await getApiUrl();
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
        onSuccess(signedTxns.successed);
      } else {
        const pushTransactionResult = async (
          signedTxn: SignedTxArgs,
        ): Promise<
          | FioServerResponse
          | {
              reason: string;
            }
        > => {
          const apiUrl = await getApiUrl();
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
        };

        const results = await Promise.allSettled(
          signedTxns.successed.map(pushTransactionResult),
        );

        const successedResults: FioServerResponse[] = [];
        const erroredResults: Error[] = [];

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
            } else {
              erroredResults.push(result.reason);
            }
          }
        });

        const res =
          successedResults.length === 1
            ? successedResults[0]
            : successedResults;

        if (
          (!res || (res && Array.isArray(res) && !res.length)) &&
          erroredResults.length
        ) {
          throw new Error(erroredResults[0].message);
        }

        onSuccess(res);

        fireActionAnalyticsEvent(analyticAction, analyticsData);
      }
    } catch (error) {
      log.error(error);
      if (canceledRegexp.test(error.message)) {
        onCancel();
      } else {
        toggleHasError(true);
        if (
          error &&
          typeof error?.message === 'string' &&
          error?.message.includes(TRANSFER_ERROR_BECAUSE_OF_NOT_BURNED_NFTS)
        ) {
          let message, title;

          const buttonText = 'Close';

          if (window?.location?.pathname === ROUTES.FIO_ADDRESS_OWNERSHIP) {
            message = CANNOT_TRANSFER_ERROR;
            title = CANNOT_TRANSFER_ERROR_TITLE;
          } else {
            message = CANNOT_UPDATE_FIO_HANDLE;
            title = CANNOT_UPDATE_FIO_HANDLE_TITLE;
          }

          setErrorObj({ message, title, buttonText });
        }

        if (isDecryptContent) {
          setErrorObj({
            message: ERROR_MESSAGE_FOR_DECRYPT_CONTENT.message,
            title: ERROR_MESSAGE_FOR_DECRYPT_CONTENT.title,
            buttonText: 'Close',
          });
        }

        fireActionAnalyticsEventError(analyticAction);
      }
    }
  }, [
    isDecryptContent,
    actionParams,
    analyticAction,
    analyticsData,
    returnOnlySignedTxn,
    derivationIndex,
    onSuccess,
    onCancel,
    setProcessing,
    handleActionParams,
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
      errorObj={errorObj}
      show={processing}
      onClose={onCancel}
    />
  );
};
