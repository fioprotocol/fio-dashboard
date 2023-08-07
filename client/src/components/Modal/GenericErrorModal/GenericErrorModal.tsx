import React from 'react';

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
  showGenericError: boolean;
};

const GenericErrorModal: React.FC<Props> = props => {
  const { genericErrorData, closeGenericErrorModal, showGenericError } = props;
  const {
    message = "We've experienced something unexpected.",
    title = 'Something Went Wrong',
    buttonText,
  } = genericErrorData || {};

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
