import React, { useEffect, useRef, useCallback, useState } from 'react';

import Processing from '../../components/common/TransactionProcessing';

import { waitForEdgeAccountStop } from '../../util/edge';

import { PinConfirmation } from '../../types';
import { Props } from './types';

const EdgeConfirmActionContainer: React.FC<Props> = props => {
  if (props.data != null) return <EdgeConfirmAction {...props} />;

  return null;
};

const EdgeConfirmAction: React.FC<Props> = props => {
  const {
    fioWalletEdgeId,
    hideProcessing,
    pinModalIsOpen,
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
  } = props;

  const init = useRef(false);
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

      if (confirmationAction !== action) return;
      if (
        !confirmationError &&
        !processing &&
        (fioWalletEdgeId ? keys && keys[fioWalletEdgeId] : true)
      ) {
        setProcessing(true);
        if (edgeAccountLogoutBefore) await waitForEdgeAccountStop(edgeAccount);
        try {
          const result = await submitAction({
            edgeAccount,
            keys: fioWalletEdgeId ? keys && keys[fioWalletEdgeId] : null,
            data: additionalData,
          });

          if (!edgeAccountLogoutBefore)
            await waitForEdgeAccountStop(edgeAccount);

          onSuccess(result);
          setConfirmPinKeys(null);
        } catch (e) {
          showGenericErrorModal();
          onCancel();
        }
      }

      if (!confirmationError) resetPinConfirm();
      if (edgeAccount != null) {
        await waitForEdgeAccountStop(edgeAccount);
      }
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
    ],
  );

  useEffect(() => () => resetPinConfirm(), [resetPinConfirm]);

  // Show pin modal
  useEffect(() => {
    if (data != null && !confirmPinKeys) showPinModal(action, data);
  }, [data, action, confirmPinKeys, showPinModal]);

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

  // Handle pin modal closed
  useEffect(() => {
    if (
      (!pinConfirmation || !pinConfirmation.action) &&
      !pinModalIsOpen &&
      !processing
    ) {
      if (init.current) {
        onCancel();
        return;
      }
      init.current = true;
    }
  }, [pinConfirmation, pinModalIsOpen, onCancel, processing]);

  return (
    <Processing
      isProcessing={processing && !hideProcessing}
      {...processingProps}
    />
  );
};

export default EdgeConfirmActionContainer;
