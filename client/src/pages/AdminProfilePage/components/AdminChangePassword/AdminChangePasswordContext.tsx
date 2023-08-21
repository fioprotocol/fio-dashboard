import { useCallback, useState } from 'react';

import { log } from '../../../../util/general';
import apis from '../../../../api';

import { FormValuesProps } from './types';

type UseContextProps = {
  error: string;
  loading: boolean;
  showChangePasswordModal: boolean;
  showSuccessModal: boolean;
  changePassword: (values: FormValuesProps) => void;
  closeChangePasswordModal: () => void;
  closeSuccessModal: () => void;
  openChangePasswordModal: () => void;
  resetError: () => void;
};

export const useContext = (): UseContextProps => {
  const [showChangePasswordModal, toggleShowChangePasswordModal] = useState<
    boolean
  >(false);
  const [showSuccessModal, toggleSuccessModal] = useState<boolean>(false);
  const [loading, toggleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const openChangePasswordModal = useCallback(() => {
    toggleShowChangePasswordModal(true);
  }, []);

  const closeChangePasswordModal = useCallback(() => {
    toggleShowChangePasswordModal(false);
  }, []);

  const closeSuccessModal = useCallback(() => {
    toggleSuccessModal(false);
  }, []);

  const changePassword = useCallback(
    async (values: FormValuesProps) => {
      try {
        toggleLoading(true);
        await apis.admin.changeAdminPassword(values);
        closeChangePasswordModal();
        toggleSuccessModal(true);
      } catch (err) {
        log.error(err);
        if (err.code) {
          setError(err.code);
        }
      } finally {
        toggleLoading(false);
      }
    },
    [closeChangePasswordModal],
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    loading,
    showChangePasswordModal,
    showSuccessModal,
    changePassword,
    closeChangePasswordModal,
    closeSuccessModal,
    openChangePasswordModal,
    resetError,
  };
};
