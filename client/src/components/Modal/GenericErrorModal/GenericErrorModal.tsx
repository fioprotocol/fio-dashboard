import React from 'react';
import DangerModal from '../DangerModal';

type Props = {
  genericErrorData?: { message: string; title?: string };
  closeGenericErrorModal: () => void;
  showGenericError: boolean;
};

const GenericErrorModal: React.FC<Props> = props => {
  const { genericErrorData, closeGenericErrorModal, showGenericError } = props;
  const {
    message = "We've experienced something unexpected.",
    title = 'Something Went Wrong',
  } = genericErrorData;
  return (
    <DangerModal
      title={title}
      buttonText="Try Again"
      subtitle={message}
      show={showGenericError}
      onActionButtonClick={closeGenericErrorModal}
      onClose={closeGenericErrorModal}
    />
  );
};

export default GenericErrorModal;
