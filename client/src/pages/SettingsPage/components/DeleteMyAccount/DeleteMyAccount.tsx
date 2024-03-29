import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import DangerModal from '../../../../components/Modal/DangerModal';
import Modal from '../../../../components/Modal/Modal';
import SecurityItem from '../SecurityItem';
import PasswordForm, { PasswordFormValues } from './PasswordForm';

import { ROUTES } from '../../../../constants/routes';
import { USER_PROFILE_TYPE } from '../../../../constants/profile';

import apis from '../../../../api';
import { log } from '../../../../util/general';

import { User } from '../../../../types';

import classes from '../../styles/DeleteMyAccount.module.scss';

const ITEM_PROPS = {
  title: 'Delete Account',
  subtitle: `Permanently delete your FIO account.`,
  dangerTitle: 'Are You Sure?',
  dangerSubtitle:
    'If you permanently delete your FIO account, you will no longer have access to this account or your crypto/NFT holdings withing this account.',
  successModalTitle: 'Account Deleted',
  successModalSubtitle: 'Your account has been deleted.',
};

type DeleteMyAccountProps = {
  user: User;
  username: string;
  logout: () => void;
  closeSuccessModal: () => void;
  showSuccessModal: (m: string, t: string) => void;
  showGenericErrorModal: () => void;
};

const SUCCESS_MODAL_TIMEOUT_MS = 2000;

const DeleteMyAccount: React.FC<DeleteMyAccountProps> = ({
  user,
  username,
  logout,
  closeSuccessModal,
  showSuccessModal,
  showGenericErrorModal,
}) => {
  const [showConfirmationModal, toggleConfirmationModal] = useState(false);
  const [showPasswordModal, togglePasswordModal] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const isProfileTypePrimary =
    user?.userProfileType === USER_PROFILE_TYPE.PRIMARY;

  const onOpenConfirmationModal = useCallback(() => {
    toggleConfirmationModal(true);
  }, []);

  const onConfirmationClose = useCallback(() => {
    toggleConfirmationModal(false);
  }, []);

  const onDeleteConfirmed = useCallback(async () => {
    toggleConfirmationModal(false);
    if (isProfileTypePrimary) {
      togglePasswordModal(true);
    } else {
      setDeletingAccount(true);

      try {
        await apis.auth.deleteUser();

        showSuccessModal(
          ITEM_PROPS.successModalSubtitle,
          ITEM_PROPS.successModalTitle,
        );

        logout();

        setTimeout(() => {
          closeSuccessModal();
        }, SUCCESS_MODAL_TIMEOUT_MS);
      } catch (error) {
        log.error(error);
        showGenericErrorModal();
      } finally {
        setDeletingAccount(false);
      }
    }
  }, [
    closeSuccessModal,
    isProfileTypePrimary,
    logout,
    showGenericErrorModal,
    showSuccessModal,
  ]);

  const onClosePasswordModal = useCallback(() => {
    togglePasswordModal(false);
  }, []);

  const onFormSubmit = async (values: PasswordFormValues) => {
    setCheckingPassword(true);
    const { username, password } = values;
    let account;
    try {
      account = await apis.edge.login(username, password);
      if (!account) throw new Error();
    } catch (e) {
      return { password: 'Invalid Password' };
    } finally {
      setCheckingPassword(false);
    }

    setDeletingAccount(true);
    try {
      await apis.auth.deleteUser();
      await apis.edge.deleteAccount(account);
      togglePasswordModal(false);
      showSuccessModal(
        ITEM_PROPS.successModalSubtitle,
        ITEM_PROPS.successModalTitle,
      );
      logout();
      setTimeout(() => {
        closeSuccessModal();
      }, SUCCESS_MODAL_TIMEOUT_MS);
    } catch (e) {
      return { password: 'Something went wrong, please try again later' };
    } finally {
      setDeletingAccount(false);
    }

    return {};
  };

  const renderDangerNotice = () => (
    <p className={classes.dangerNotice}>
      Please, make sure that you have exported your private keys for each
      <Link className="ml-1" to={ROUTES.TOKENS}>
        wallet
      </Link>{' '}
      to prevent loss of those holdings.
    </p>
  );

  return (
    <SecurityItem
      {...ITEM_PROPS}
      buttonText="Delete My Account"
      isGreen={true}
      onClick={onOpenConfirmationModal}
      bottomChildren={true}
    >
      <DangerModal
        show={showConfirmationModal}
        onClose={onConfirmationClose}
        onActionButtonClick={onDeleteConfirmed}
        buttonText="Yes, Delete My Account"
        showCancel={true}
        title={ITEM_PROPS.dangerTitle}
        subtitle={ITEM_PROPS.dangerSubtitle}
        notice={isProfileTypePrimary ? renderDangerNotice() : null}
        loading={deletingAccount}
      />
      <Modal
        show={showPasswordModal}
        onClose={onClosePasswordModal}
        closeButton={true}
        backdrop="static"
      >
        <>
          <h3>Confirm Deletion</h3>
          <p>Enter your password to confirm deleting of this account</p>
          <PasswordForm
            onSubmit={onFormSubmit}
            loading={checkingPassword || deletingAccount}
            username={username}
          />
        </>
      </Modal>
    </SecurityItem>
  );
};

export default DeleteMyAccount;
