import React from 'react';

import SuccessModal from '../SuccessModal';

type Props = {
  genericSuccessData?: { message: string; title?: string; buttonText?: string };
  closeGenericSuccessModal: () => void;
  showGenericSuccess: boolean;
};

const GenericSuccessModal: React.FC<Props> = props => {
  const {
    genericSuccessData,
    closeGenericSuccessModal,
    showGenericSuccess,
  } = props;
  const {
    message = 'Operation completed successfully.',
    title = 'Operation successful',
    buttonText = 'Close',
  } = genericSuccessData || {};
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
