import React, { useEffect, useCallback, useRef } from 'react';
import isEqual from 'lodash/isEqual';

import Processing from '../../components/common/TransactionProcessing';

import { CONFIRM_FIO_ACTIONS } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import {
  CANNOT_DECRYPT_CONTENT_ERROR,
  CANNOT_TRANSFER_ERROR,
  CANNOT_TRANSFER_ERROR_TITLE,
  CANNOT_UPDATE_FIO_HANDLE,
  CANNOT_UPDATE_FIO_HANDLE_TITLE,
  ERROR_MESSAGE_FOR_DECRYPT_CONTENT,
  TRANSFER_ERROR_BECAUSE_OF_NOT_BURNED_NFTS,
  LIMIT_EXCEEDED_ERROR,
  LIMIT_EXCEEDED_ERROR_TITLE,
  LIMIT_EXCEEDED_CODE,
} from '../../constants/errors';

import { waitForEdgeAccountStop } from '../../util/edge';
import { log, removeExtraCharactersFromString } from '../../util/general';
import {
  fireActionAnalyticsEvent,
  fireActionAnalyticsEventError,
} from '../../util/analytics';

import { PinConfirmation, FioActions, AnyType } from '../../types';
import { Props } from './types';

const EdgeConfirmActionContainer: React.FC<Props> = props => {
  if (props.data != null) return <EdgeConfirmAction {...props} />;

  return null;
};

const EdgeConfirmAction: React.FC<Props> = props => {
  const {
    fioWalletEdgeId,
    hideProcessing,
    pinConfirmation,
    action,
    data,
    edgeAccountLogoutBefore,
    processing,
    processingProps,
    confirmPinKeys,

    setProcessing,
    submitAction,
    onSuccess,
    onCancel,
    showPinModal,
    showGenericErrorModal,
    resetPinConfirm,
    setConfirmPinKeys,
    fioActionExecuted,
  } = props;

  const lastDataRef = useRef<AnyType>(null);

  // Submit an action
  const submit = useCallback(
    async (pinConfirmationResult: PinConfirmation) => {
      const {
        account: edgeAccount,
        error: confirmationError,
        action: confirmationAction,
        keys,
        data: additionalData,
      } = pinConfirmationResult;

      let result: AnyType;

      if (confirmationAction !== action) return;
      if (
        !confirmationError &&
        !processing &&
        (fioWalletEdgeId ? keys && keys[fioWalletEdgeId] : true)
      ) {
        setProcessing(true);
        if (edgeAccountLogoutBefore) await waitForEdgeAccountStop(edgeAccount);
        try {
          result = await submitAction({
            edgeAccount,
            keys: fioWalletEdgeId ? keys && keys[fioWalletEdgeId] : null,
            allWalletKeysInAccount: fioWalletEdgeId ? null : keys,
            data: additionalData,
          });

          if (!edgeAccountLogoutBefore)
            await waitForEdgeAccountStop(edgeAccount);

          fireActionAnalyticsEvent(action, additionalData);

          // todo: check returned results for all fio actions
          if (CONFIRM_FIO_ACTIONS[action as keyof FioActions] && result) {
            fioActionExecuted({
              result: { status: result.status, txIds: result.transaction_id },
              executeActionType: removeExtraCharactersFromString(action),
            });
          }

          setConfirmPinKeys(null);
        } catch (e) {
          log.error('EDGE action Error', e);
          fireActionAnalyticsEventError(action);
          let buttonText,
            message,
            title,
            cancelAction = false;

          if (e.message && typeof e.message === 'string') {
            buttonText = 'Close';

            if (e.message === TRANSFER_ERROR_BECAUSE_OF_NOT_BURNED_NFTS) {
              if (window?.location?.pathname === ROUTES.FIO_ADDRESS_OWNERSHIP) {
                message = CANNOT_TRANSFER_ERROR;
                title = CANNOT_TRANSFER_ERROR_TITLE;
              } else {
                message = CANNOT_UPDATE_FIO_HANDLE;
                title = CANNOT_UPDATE_FIO_HANDLE_TITLE;
              }
            }

            if (e.message === CANNOT_DECRYPT_CONTENT_ERROR) {
              message = ERROR_MESSAGE_FOR_DECRYPT_CONTENT.message;
              title = ERROR_MESSAGE_FOR_DECRYPT_CONTENT.title;
            }
          }

          if (
            e.code &&
            typeof e.code === 'string' &&
            e.code === LIMIT_EXCEEDED_CODE
          ) {
            buttonText = 'Close';

            message = LIMIT_EXCEEDED_ERROR;
            title = LIMIT_EXCEEDED_ERROR_TITLE;
            cancelAction = true;
          }

          showGenericErrorModal(message, title, buttonText);
          onCancel({ cancelAction });
        }
      }

      if (!confirmationError) resetPinConfirm();
      if (edgeAccount != null) {
        await waitForEdgeAccountStop(edgeAccount);
      }

      onSuccess(result);
    },
    [
      action,
      edgeAccountLogoutBefore,
      fioWalletEdgeId,
      processing,
      onCancel,
      onSuccess,
      resetPinConfirm,
      setConfirmPinKeys,
      setProcessing,
      showGenericErrorModal,
      submitAction,
      fioActionExecuted,
    ],
  );

  useEffect(() => () => resetPinConfirm(), [resetPinConfirm]);

  // Show pin modal
  useEffect(() => {
    if (
      data != null &&
      !confirmPinKeys &&
      !isEqual(data, lastDataRef.current)
    ) {
      const pinData = data ? { ...data, onCancel } : null;
      lastDataRef.current = data;
      showPinModal(action, pinData);
    }
  }, [data, action, confirmPinKeys, showPinModal, onCancel]);

  // Handle confirmPinKeys is set
  useEffect(() => {
    if (data != null && confirmPinKeys && !processing) {
      submit({
        keys: confirmPinKeys,
        action,
        data,
      });
    }
  }, [data, action, confirmPinKeys, submit, processing]);

  // Handle pin confirmation
  useEffect(() => {
    if (
      pinConfirmation != null &&
      pinConfirmation.action &&
      pinConfirmation.action === action &&
      !processing
    ) {
      submit(pinConfirmation);
    }
  }, [pinConfirmation, action, processing, submit]);

  return (
    <Processing
      isProcessing={processing && !hideProcessing}
      {...processingProps}
    />
  );
};

export default EdgeConfirmActionContainer;
