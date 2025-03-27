import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MetaMaskInpageProvider } from '@metamask/providers';

import DangerModal from '../../../../components/Modal/DangerModal';
import Modal from '../../../../components/Modal/Modal';
import SecurityItem from '../SecurityItem';
import PasswordForm, { PasswordFormValues } from './PasswordForm';

import { useMetaMaskProvider } from '../../../../hooks/useMetaMaskProvider';

import apis from '../../../../api';
import { authenticateWallet } from '../../../../services/api/wallet';
import { log } from '../../../../util/general';

import { ROUTES } from '../../../../constants/routes';
import { USER_PROFILE_TYPE } from '../../../../constants/profile';
import {
  ERROR_MESSAGES_BY_CODE,
  WALLET_API_PROVIDER_ERRORS_CODE,
} from '../../../../constants/errors';
import { WALLET_CREATED_FROM } from '../../../../constants/common';

import { User } from '../../../../types';
import { EdgeWalletApiProvider } from '../../../../services/api/wallet/edge';

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
  showSuccessModal: (m: string, t: string, tm?: number) => void;
  showGenericErrorModal: () => void;
};

const SUCCESS_MODAL_TIMEOUT_MS = 5000;

const DeleteMyAccount: React.FC<DeleteMyAccountProps> = ({
  user,
  username,
  logout,
  showSuccessModal,
  showGenericErrorModal,
}) => {
  const metaMaskProvider = useMetaMaskProvider();
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

  const deleteAccount = useCallback(
    async (authParams: {
      username?: string;
      password?: string;
      provider?: MetaMaskInpageProvider;
    }) => {
      setDeletingAccount(true);
      try {
        const { walletApiProvider, nonce } = await authenticateWallet({
          walletProviderName: isProfileTypePrimary
            ? WALLET_CREATED_FROM.EDGE
            : WALLET_CREATED_FROM.METAMASK,
          authParams,
        });

        await apis.auth.deleteUser(nonce);

        if (isProfileTypePrimary) {
          await apis.edge.deleteAccount(
            (walletApiProvider as EdgeWalletApiProvider).account,
          );
        }

        await walletApiProvider.logout();

        showSuccessModal(
          ITEM_PROPS.successModalSubtitle,
          ITEM_PROPS.successModalTitle,
          SUCCESS_MODAL_TIMEOUT_MS,
        );

        setDeletingAccount(false);
        logout();
      } catch (error) {
        setDeletingAccount(false);
        log.error(error);

        throw error;
      }
    },
    [isProfileTypePrimary, logout, showGenericErrorModal, showSuccessModal],
  );

  const onDeleteConfirmed = useCallback(async () => {
    if (isProfileTypePrimary) {
      toggleConfirmationModal(false);
      togglePasswordModal(true);
    } else {
      try {
        await deleteAccount({
          provider: metaMaskProvider as MetaMaskInpageProvider,
        });
      } catch (error) {
        toggleConfirmationModal(false);

        if (error?.code !== WALLET_API_PROVIDER_ERRORS_CODE.REJECTED) {
          showGenericErrorModal();
        }
      }
    }
  }, [deleteAccount, isProfileTypePrimary, metaMaskProvider]);

  const onClosePasswordModal = useCallback(() => {
    togglePasswordModal(false);
  }, []);

  const onFormSubmit = async (values: PasswordFormValues) => {
    setCheckingPassword(true);

    try {
      await deleteAccount(values);
    } catch (error) {
      log.error(error);

      setCheckingPassword(false);
      if (!error.code) showGenericErrorModal();

      return {
        password:
          ERROR_MESSAGES_BY_CODE[
            error?.code as keyof typeof ERROR_MESSAGES_BY_CODE
          ] || ERROR_MESSAGES_BY_CODE.SERVER_ERROR,
      };
    }

    return {};
  };

  useEffect(() => {
    return () => {
      setDeletingAccount(false);
      toggleConfirmationModal(false);
      togglePasswordModal(false);
    };
  }, []);

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
