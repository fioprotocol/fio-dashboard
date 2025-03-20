import React, { useEffect, useRef } from 'react';

import SuccessModal from '../SuccessModal';

type Props = {
  genericSuccessData?: {
    message: string;
    title?: string;
    buttonText?: string;
    timeout?: number;
  };
  closeGenericSuccessModal: () => void;
  clearGenericSuccessData: () => void;
  showGenericSuccess: boolean;
};

const GenericSuccessModal: React.FC<Props> = props => {
  const {
    genericSuccessData,
    closeGenericSuccessModal,
    clearGenericSuccessData,
    showGenericSuccess,
  } = props;
  const {
    message = 'Operation completed successfully.',
    title = 'Operation successful',
    buttonText = 'Close',
    timeout = null,
  } = genericSuccessData || {};

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Clear any existing timeout before setting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout if modal is showing
    if (timeout && showGenericSuccess) {
      timeoutRef.current = setTimeout(closeGenericSuccessModal, timeout);
    }
  }, [timeout, closeGenericSuccessModal, showGenericSuccess]);

  // avoid text blinking on modal close animation
  useEffect(() => {
    if (!showGenericSuccess) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(clearGenericSuccessData, 1000);
    }
  }, [showGenericSuccess, clearGenericSuccessData]);

  return (
    <SuccessModal
      title={title}
      buttonText={buttonText}
      subtitle={message}
      showModal={showGenericSuccess}
      onClose={closeGenericSuccessModal}
    />
  );
};

export default GenericSuccessModal;
