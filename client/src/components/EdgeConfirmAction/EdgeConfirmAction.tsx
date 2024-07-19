import React, { useEffect, useCallback, useState } from 'react';

import Processing from '../../components/common/TransactionProcessing';

import { CONFIRM_FIO_ACTIONS } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import {
  CANNOT_TRANSFER_ERROR,
  CANNOT_TRANSFER_ERROR_TITLE,
  CANNOT_UPDATE_FIO_HANDLE,
  CANNOT_UPDATE_FIO_HANDLE_TITLE,
  TRANSFER_ERROR_BECAUSE_OF_NOT_BURNED_NFTS,
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

  const [initLaunch, setInitLaunch] = useState<boolean>(false);

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
          let buttonText, message, title;

          if (
            e.message &&
            typeof e.message === 'string' &&
            e.message === TRANSFER_ERROR_BECAUSE_OF_NOT_BURNED_NFTS
          ) {
            buttonText = 'Close';

            if (window?.location?.pathname === ROUTES.FIO_ADDRESS_OWNERSHIP) {
              message = CANNOT_TRANSFER_ERROR;
              title = CANNOT_TRANSFER_ERROR_TITLE;
            } else {
              message = CANNOT_UPDATE_FIO_HANDLE;
              title = CANNOT_UPDATE_FIO_HANDLE_TITLE;
            }
          }

          showGenericErrorModal(message, title, buttonText);
          onCancel();
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
    if (data != null && !confirmPinKeys && !initLaunch)
      showPinModal(action, data);
  }, [data, action, confirmPinKeys, showPinModal, initLaunch]);

  // Handle confirmPinKeys is set
  useEffect(() => {
    if (!initLaunch && data != null && confirmPinKeys && !processing) {
      setInitLaunch(true);
      submit({
        keys: confirmPinKeys,
        action,
        data,
      });
    }
  }, [data, action, confirmPinKeys, initLaunch, submit, processing]);

  // Handle pin confirmation
  useEffect(() => {
    if (
      pinConfirmation != null &&
      pinConfirmation.action &&
      pinConfirmation.action === action &&
      !processing &&
      !initLaunch
    ) {
      setInitLaunch(true);
      submit(pinConfirmation);
    }
  }, [pinConfirmation, action, processing, submit, initLaunch]);

  return (
    <Processing
      isProcessing={processing && !hideProcessing}
      {...processingProps}
    />
  );
};

export default EdgeConfirmActionContainer;
