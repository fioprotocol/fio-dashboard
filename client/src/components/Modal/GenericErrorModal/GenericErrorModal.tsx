import React, { useEffect, useRef } from 'react';

import DangerModal from '../DangerModal';
import PageTitle from '../../PageTitle/PageTitle';

import { LINKS } from '../../../constants/labels';

type Props = {
  genericErrorData?: {
    message: string;
    title?: string;
    buttonText?: string | null;
  };
  closeGenericErrorModal: () => void;
  clearGenericErrorData?: () => void;
  showGenericError: boolean;
};

const GenericErrorModal: React.FC<Props> = props => {
  const {
    genericErrorData,
    closeGenericErrorModal,
    clearGenericErrorData,
    showGenericError,
  } = props;
  const {
    message = "We've experienced something unexpected.",
    title = 'Something Went Wrong',
    buttonText,
  } = genericErrorData || {};
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // avoid text blinking on modal close animation
  useEffect(() => {
    if (!showGenericError && clearGenericErrorData) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(clearGenericErrorData, 1000);
    }
  }, [showGenericError, clearGenericErrorData]);

  return (
    <>
      {showGenericError && <PageTitle link={LINKS.ERROR} isVirtualPage />}
      <DangerModal
        title={title}
        buttonText={buttonText || 'Try Again'}
        subtitle={message}
        show={showGenericError}
        onActionButtonClick={closeGenericErrorModal}
        onClose={closeGenericErrorModal}
      />
    </>
  );
};

export default GenericErrorModal;
