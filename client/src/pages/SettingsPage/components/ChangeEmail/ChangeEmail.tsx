import React, { useState } from 'react';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import ActionButton from '../ActionButton';
import ModalUIComponent from '../ModalUIComponent';
import ChangeEmailForm from './ChangeEmailForm';
import EdgeConfirmAction from '../../../../components/EdgeConfirmAction';
import SuccessModal from '../../../../components/Modal/SuccessModal';

import { CONFIRM_PIN_ACTIONS } from '../../../../constants/common';
import { USER_PROFILE_TYPE } from '../../../../constants/profile';

import { emailAvailable } from '../../../../api/middleware/auth';
import { minWaitTimeFunction } from '../../../../utils';
import { log } from '../../../../util/general';

import apis from '../../../../api';

import { User } from '../../../../types';
import { FormValuesProps } from './types';
import { SubmitActionParams } from '../../../../components/EdgeConfirmAction/types';

import classes from './ChangeEmail.module.scss';

const SUCCESS_MODAL_CONTENT = {
  successModalTitle: 'EMAIL CHANGED!',
  successModalSubtitle: 'Your email has been successfully changed',
};

type Props = {
  user: User;
  pinModalIsOpen: boolean;
  loading: boolean;
  loadProfile: () => void;
};

const ChangeEmail: React.FC<Props> = props => {
  const { user, pinModalIsOpen, loading, loadProfile } = props;
  const [showModal, toggleModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<{
    newEmail: string;
  } | null>(null);

  const isPrimaryProfile = user?.userProfileType === USER_PROFILE_TYPE.PRIMARY;

  const onCancel = () => {
    setProcessing(false);
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onSuccessClose = () => toggleSuccessModal(false);

  const onCloseModal = () => {
    if (!processing && !loading) toggleModal(false);
  };

  const onActionButtonClick = () => {
    toggleModal(true);
    setSubmitData(null);
  };

  const submit = async ({ data }: SubmitActionParams) => {
    const { newEmail } = data;
    try {
      const res = await apis.auth.updateEmail(newEmail);
      if (res) {
        // await apis.auth.profile();
        loadProfile();
        onCloseModal();
        toggleSuccessModal(true);
      }
    } catch (err) {
      log.error(err);
    }
  };

  const onSubmit = async (values: FormValuesProps) => {
    const { newEmail } = values;

    const result = await minWaitTimeFunction(
      () => emailAvailable(newEmail),
      1000,
    );
    if (result.error)
      return { newEmail: 'This Email Address is already registered' };

    if (isPrimaryProfile) {
      setSubmitData({ newEmail });
    } else {
      submit({ data: { newEmail } });
    }
    return {};
  };

  return (
    <div>
      {!user.email && (
        <p className={classes.text}>
          Add your email address in order to receive FIO App notifications.
        </p>
      )}
      <div className={classes.badgeContainer}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.user}>
            {user.email ? user.email : 'Enter your email address'}
          </div>
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
          subtitle="Your email address is used access your FIO App and recover your account."
        >
          <ChangeEmailForm
            onSubmit={onSubmit}
            loading={loading || processing}
            initialValues={submitData}
          />
        </ModalUIComponent>
        {isPrimaryProfile && (
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
        )}
        <SuccessModal
          title={SUCCESS_MODAL_CONTENT.successModalTitle}
          subtitle={SUCCESS_MODAL_CONTENT.successModalSubtitle}
          onClose={onSuccessClose}
          showModal={showSuccessModal}
        />
      </div>
    </div>
  );
};

export default ChangeEmail;
