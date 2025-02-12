import React, { useState } from 'react';

import EdgeConfirmAction from '../../../../components/EdgeConfirmAction';
import SendLinkModal from '../SendLinkModal';
import ActionButton from '../ActionButton';
import EmailModal from '../../../../components/Modal/EmailModal';

import apis from '../../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';

import { SubmitActionParams } from '../../../../components/EdgeConfirmAction/types';

import classes from '../../styles/PasswordRecovery.module.scss';

type Props = {
  loading: boolean;
  genericErrorIsShowing: boolean;
};

const ResendEmail: React.FC<Props> = props => {
  const { loading, genericErrorIsShowing } = props;
  const [submitData, setSubmitData] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showSendEmailModal, toggleSendEmailModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);

  const submit = async ({ edgeAccount }: SubmitActionParams) => {
    toggleSendEmailModal(true);
    const token = await apis.edge.getToken(edgeAccount.username);
    return apis.auth.resendRecovery(token);
  };

  const onCancel = ({
    cancelAction = false,
  }: { cancelAction?: boolean } = {}) => {
    setSubmitData(null);
    setProcessing(false);
    toggleSendEmailModal(!cancelAction);
  };
  const onSuccess = (result: { success: boolean }) => {
    if (result?.success) {
      setSubmitData(null);
      setProcessing(false);

      toggleSendEmailModal(false);
      toggleSuccessModal(true);
    } else {
      onCancel({ cancelAction: true });
    }
  };
  const onResendClick = () => {
    toggleSendEmailModal(true);
  };

  const onSendEmailClick = () => {
    setSubmitData(true);
    toggleSendEmailModal(false);
  };

  const onSendEmailModalClose = () => {
    toggleSendEmailModal(false);
  };

  const onSuccessClose = () => {
    toggleSuccessModal(false);
  };

  return (
    <>
      <EdgeConfirmAction
        action={CONFIRM_PIN_ACTIONS.RESEND_EMAIL}
        setProcessing={setProcessing}
        onSuccess={onSuccess}
        onCancel={onCancel}
        processing={processing}
        data={submitData}
        submitAction={submit}
        hideProcessing={true}
      />
      <div className={classes.buttonContainer}>
        <ActionButton
          title="Resend Recovery Email"
          onClick={onResendClick}
          isIndigo
        />
      </div>
      <SendLinkModal
        show={showSendEmailModal && !genericErrorIsShowing}
        onClose={onSendEmailModalClose}
        onClick={onSendEmailClick}
        loading={loading || processing}
      />
      <EmailModal
        show={showSuccessModal}
        title="On the Way!"
        subtitle="An email with your recovery token has been sent to the email address entered."
        onClose={onSuccessClose}
      >
        <button onClick={onSuccessClose} className={classes.closeButton}>
          Close
        </button>
      </EmailModal>
    </>
  );
};

export default ResendEmail;
