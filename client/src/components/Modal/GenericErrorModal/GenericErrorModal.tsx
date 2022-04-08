import React from 'react';

import DangerModal from '../DangerModal';

type Props = {
  genericErrorData?: { message: string; title?: string; buttonText?: string };
  closeGenericErrorModal: () => void;
  showGenericError: boolean;
};

const GenericErrorModal: React.FC<Props> = props => {
  const { genericErrorData, closeGenericErrorModal, showGenericError } = props;
  const {
    message = "We've experienced something unexpected.",
    title = 'Something Went Wrong',
    buttonText = 'Try Again',
  } = genericErrorData || {};
  return (
    <DangerModal
      title={title}
      buttonText={buttonText}
      subtitle={message}
      show={showGenericError}
      onActionButtonClick={closeGenericErrorModal}
      onClose={closeGenericErrorModal}
    />
  );
};

export default GenericErrorModal;
