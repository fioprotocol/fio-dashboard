import React, { useEffect, useRef } from 'react';

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

    setProcessing,
    submitAction,
    onSuccess,
    onCancel,
    showPinModal,
    showGenericErrorModal,
    resetPinConfirm,
  } = props;

  const init = useRef(false);

  useEffect(() => () => resetPinConfirm(), []);

  useEffect(() => {
    if (data != null) showPinModal(action, data);
  }, [data]);

  // Handle pin confirmation
  useEffect(() => {
    if (
      pinConfirmation != null &&
      pinConfirmation.action &&
      pinConfirmation.action === action
    ) {
      submit(pinConfirmation);
      return;
    }
    if ((!pinConfirmation || !pinConfirmation.action) && !pinModalIsOpen) {
      if (init.current) {
        onCancel();
        return;
      }
      init.current = true;
    }
  }, [pinConfirmation, pinModalIsOpen]);

  // Submit an action
  const submit = async (pinConfirmationResult: PinConfirmation) => {
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

        if (!edgeAccountLogoutBefore) await waitForEdgeAccountStop(edgeAccount);

        onSuccess(result);
      } catch (e) {
        showGenericErrorModal();
        onCancel();
      }
    }

    if (!confirmationError) resetPinConfirm();
    if (edgeAccount != null) {
      await waitForEdgeAccountStop(edgeAccount);
    }
  };

  return (
    <Processing
      isProcessing={processing && !hideProcessing}
      {...processingProps}
    />
  );
};

export default EdgeConfirmActionContainer;
