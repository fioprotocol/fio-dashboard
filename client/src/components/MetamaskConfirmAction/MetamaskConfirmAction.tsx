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

const canceledRegexp = /transaction cacneled|decrypt fio data canceled/i;

type Props = {
  actionParams: ActionParams | DecryptActionParams;
  callSubmitAction?: boolean;
  isDecryptContent?: boolean;
  processing: boolean;
  returnOnlySignedTxn?: boolean;
  onCancel: () => void;
  onSuccess: (result: FioServerResponse) => void;
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

      const signedTxn = await signTxn({ ...actionParams, apiUrl });

      if (returnOnlySignedTxn) {
        onSuccess(signedTxn);
      } else {
        const pushResult = await fetch(`${apiUrl}/v1/chain/push_transaction`, {
          body: JSON.stringify(signedTxn),
          method: 'POST',
        });

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