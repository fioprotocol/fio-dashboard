import React, { useCallback, useEffect, useState } from 'react';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import SuccessModal from '../../../../components/Modal/SuccessModal';
import { usernameAvailable } from '../../../../components/CreateAccountForm/middleware';
import Modal from '../../../../components/Modal/Modal';

import ActionButton from '../ActionButton';
import ModalUIComponent from '../ModalUIComponent';

import ChangeEmailForm from './components/ChangeEmailForm/ChangeEmailForm';
import { PasswordForm } from './components/PasswordForm';

import { CONFIRM_METAMASK_ACTION } from '../../../../constants/common';
import { USER_PROFILE_TYPE } from '../../../../constants/profile';

import { log } from '../../../../util/general';
import { emailToUsername } from '../../../../utils';
import { fireActionAnalyticsEvent } from '../../../../util/analytics';

import { useMetaMaskProvider } from '../../../../hooks/useMetaMaskProvider';

import apis from '../../../../api';

import { User } from '../../../../types';
import { FormValuesProps } from './types';

import classes from './ChangeEmail.module.scss';

const SUCCESS_MODAL_CONTENT = {
  successModalTitle: 'EMAIL CHANGED!',
  successModalSubtitle: 'Your email has been successfully changed',
};

type Props = {
  user: User;
  preopenedEmailModal: boolean;
  loadProfile: () => void;
};

const ChangeEmail: React.FC<Props> = props => {
  const { user, preopenedEmailModal, loadProfile } = props;
  const [showModal, toggleModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [submitData, setSubmitData] = useState<{
    newEmail: string;
    newUsername?: string;
  } | null>(null);
  const [error, setError] = useState(false);
  const [passwordModalError, setPasswordModalError] = useState<Error | null>(
    null,
  );
  const [showPasswordModal, togglePasswordModal] = useState(false);
  const metaMaskProvider = useMetaMaskProvider();
  const isMetaMask = !!metaMaskProvider;

  const isPrimaryProfile = user?.userProfileType === USER_PROFILE_TYPE.PRIMARY;

  const onSuccessClose = () => toggleSuccessModal(false);

  const onCloseModal = useCallback(() => {
    if (!loading) {
      setSubmitData(null);
      toggleModal(false);
    }
  }, [loading]);

  const onClosePasswordModal = useCallback(() => {
    if (!loading) {
      setSubmitData(null);
      setPasswordModalError(null);
      togglePasswordModal(false);
    }
  }, [loading]);

  const onActionButtonClick = () => {
    setError(false);
    toggleModal(true);
    setSubmitData(null);
  };

  const onPasswordFormChange = () => {
    setPasswordModalError(null);
  };

  useEffect(() => {
    if (preopenedEmailModal) {
      toggleModal(true);
    }
  }, [preopenedEmailModal]);

  const onChangeEmail = useCallback(
    async ({ password }: { password?: string } = {}) => {
      const { newEmail } = submitData;
      toggleLoading(true);

      try {
        const updateEmailResult = await apis.auth.updateEmail({
          newEmail,
        });

        let updateEmailSuccess = !!updateEmailResult;
        const updatedUsername = updateEmailResult.newUsername;

        if (updatedUsername && password && showPasswordModal) {
          try {
            await apis.edge.changeUsername({
              newUsername: updatedUsername,
              password,
              username: user?.username,
            });
          } catch (error) {
            log.error('Change edge username error');

            updateEmailSuccess = false;

            await apis.auth.updateEmail({
              newEmail: user?.email,
              newUsername: user?.username,
            });

            toggleLoading(false);
            setPasswordModalError(error);
          }
        }

        if (updateEmailSuccess) {
          loadProfile();
          setSubmitData(null);
          toggleLoading(false);
          toggleModal(false);
          togglePasswordModal(false);
          toggleSuccessModal(true);
        }
      } catch (err) {
        log.error(err);
        setError(true);

        toggleLoading(false);
        setSubmitData(null);
        togglePasswordModal(false);
      }
    },
    [loadProfile, showPasswordModal, submitData, user?.email, user?.username],
  );

  const handleChangeEmail = useCallback(
    async (values: FormValuesProps) => {
      const { newEmail } = values;
      error && setError(false);

      if (isPrimaryProfile) {
        const newUsername = emailToUsername(newEmail);

        const { error: usernameError } = await usernameAvailable(newUsername);

        if (usernameError) {
          setError(true);

          toggleLoading(false);
          return { newEmail: 'This username is not available' };
        }

        setSubmitData({ newEmail, newUsername });
      } else {
        const analyticsData = { newEmail };
        let analyticAction: string;

        if (isMetaMask) {
          analyticAction = CONFIRM_METAMASK_ACTION.UPDATE_EMAIL;
        }

        fireActionAnalyticsEvent(analyticAction, analyticsData);

        setSubmitData({ newEmail });
      }
      return {};
    },
    [error, isPrimaryProfile, isMetaMask],
  );

  useEffect(() => {
    if (submitData?.newEmail && !showPasswordModal) {
      if (submitData?.newUsername) {
        togglePasswordModal(true);
      } else {
        onChangeEmail();
      }
    }
  }, [submitData, onChangeEmail, showPasswordModal]);

  return (
    <div>
      {!user.email && (
        <p className={classes.text}>
          Add your email address in order to receive FIO App notifications.
        </p>
      )}
      <div className={classes.badgeContainer}>
        {user.email && (
          <Badge show={true} type={BADGE_TYPES.WHITE}>
            <div className={classes.user}>{user.email}</div>
          </Badge>
        )}
        <div className={classes.buttonContainer}>
          <ActionButton
            title={`${
              !user.email ? 'Setup Email Address' : 'Update Email Address'
            }`}
            onClick={onActionButtonClick}
          />
        </div>
        <ModalUIComponent
          onClose={onCloseModal}
          showModal={showModal}
          isWide={true}
          title={!user.email ? 'Setup Email' : 'Update Email'}
          subtitle="Your email address is used access your FIO App and recover your account."
        >
          <ChangeEmailForm
            hasNoEmail={!user.email}
            onSubmit={handleChangeEmail}
            loading={loading}
            error={error}
            setError={setError}
          />
        </ModalUIComponent>
        {isPrimaryProfile && (
          <Modal
            show={showPasswordModal}
            onClose={onClosePasswordModal}
            closeButton
            backdrop="static"
            isSecondModal
          >
            <>
              <h3>Email Change</h3>
              <p>Enter your password to confirm email change</p>
              <PasswordForm
                error={passwordModalError}
                loading={loading}
                onChange={onPasswordFormChange}
                onSubmit={onChangeEmail}
              />
            </>
          </Modal>
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
