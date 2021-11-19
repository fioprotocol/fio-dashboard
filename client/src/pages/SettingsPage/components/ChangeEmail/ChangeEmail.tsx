import React, { useState } from 'react';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import ActionButton from '../ActionButton';
import ModalUIComponent from '../ModalUIComponent';
import ChangeEmailForm from './ChangeEmailForm';
import EdgeConfirmAction from '../../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';

import { User } from '../../../../types';
import { FormValuesProps } from './types';
import { SubmitActionParams } from '../../../../components/EdgeConfirmAction/types';

import classes from '../../styles/ChangeEmail.module.scss';

type Props = {
  user: User;
  updateEmailRequest: (oldEmail: string, newEmail: string) => void;
  pinModalIsOpen: boolean;
  loading: boolean;
};

const ChangeEmail: React.FC<Props> = props => {
  const { user, updateEmailRequest, pinModalIsOpen, loading } = props;
  const [showModal, toggleModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<{
    newEmail: string;
    oldEmail: string;
  } | null>(null);

  const onCancel = () => {
    setProcessing(false);
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCloseModal = () => {
    if (!processing && !loading) toggleModal(false);
  };

  const onActionButtonClick = () => {
    toggleModal(true);
    setSubmitData(null);
  };

  const submit = async ({ data }: SubmitActionParams) => {
    const { oldEmail, newEmail } = data;
    updateEmailRequest(oldEmail, newEmail);
  };

  const onSubmit = (values: FormValuesProps) => {
    const { email: oldEmail } = user;
    const { newEmail } = values;

    setSubmitData({ oldEmail, newEmail });
    return {};
  };

  return (
    <div>
      <div className={classes.badgeContainer}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.user}>{user.email}</div>
        </Badge>
        <div className={classes.buttonContainer}>
          <ActionButton
            title="Update Email Address"
            onClick={onActionButtonClick}
          />
        </div>
        <ModalUIComponent
          onClose={onCloseModal}
          showModal={showModal && !pinModalIsOpen}
          isWide={true}
          title="Update Email"
          subtitle="Your email address is used access your FIO dashboard and recover your account."
        >
          <ChangeEmailForm
            onSubmit={onSubmit}
            loading={loading || processing}
            initialValues={submitData}
          />
        </ModalUIComponent>
        <EdgeConfirmAction
          action={CONFIRM_PIN_ACTIONS.UPDATE_EMAIL}
          setProcessing={setProcessing}
          onSuccess={onSuccess}
          onCancel={onCancel}
          processing={processing}
          data={submitData}
          submitAction={submit}
          edgeAccountLogoutBefore={true}
          hideProcessing={true}
        />
      </div>
    </div>
  );
};

export default ChangeEmail;
