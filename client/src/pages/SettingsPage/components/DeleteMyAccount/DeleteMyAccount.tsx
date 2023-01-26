import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import SuccessModal from '../../../../components/Modal/SuccessModal';
import DangerModal from '../../../../components/Modal/DangerModal';
import Modal from '../../../../components/Modal/Modal';
import SecurityItem from '../SecurityItem';
import PasswordForm, { PasswordFormValues } from './PasswordForm';

import { ROUTES } from '../../../../constants/routes';

import apis from '../../../../api';

import classes from '../../styles/DeleteMyAccount.module.scss';
import Processing from '../../../../components/common/TransactionProcessing';

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
  username: string;
  logout: () => void;
};

const DeleteMyAccount: React.FC<DeleteMyAccountProps> = ({
  username,
  logout,
}) => {
  const [showConfirmationModal, toggleConfirmationModal] = useState(false);
  const [showPasswordModal, togglePasswordModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const onSuccessClose = () => {
    toggleSuccessModal(false);
  };

  const onOpenConfirmationModal = () => {
    toggleConfirmationModal(true);
  };

  const onConfirmationClose = () => {
    toggleConfirmationModal(false);
  };

  const onDeleteConfirmed = () => {
    toggleConfirmationModal(false);
    togglePasswordModal(true);
  };

  const onClosePasswordModal = () => {
    togglePasswordModal(false);
  };

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
      toggleSuccessModal(true);
      setTimeout(logout, 1000);
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
        notice={renderDangerNotice()}
      />
      <Modal
        show={showPasswordModal}
        onClose={onClosePasswordModal}
        closeButton={true}
        backdrop="static"
      >
        {deletingAccount ? (
          <Processing isProcessing={deletingAccount} />
        ) : (
          <>
            <h3>Confirm Deletion</h3>
            <p>Enter your password to confirm deletion of this account</p>
            <PasswordForm
              onSubmit={onFormSubmit}
              loading={checkingPassword}
              username={username}
            />
          </>
        )}
      </Modal>
      <SuccessModal
        title={ITEM_PROPS.successModalTitle}
        subtitle={ITEM_PROPS.successModalSubtitle}
        onClose={onSuccessClose}
        showModal={showSuccessModal}
      />
    </SecurityItem>
  );
};

export default DeleteMyAccount;
