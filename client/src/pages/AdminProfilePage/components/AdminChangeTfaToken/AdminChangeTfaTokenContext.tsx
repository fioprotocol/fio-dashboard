import { useCallback, useState } from 'react';

import { GeneratedSecret } from 'speakeasy';

import { copyToClipboard, log } from '../../../../util/general';
import apis from '../../../../admin/api';
import useEffectOnce from '../../../../hooks/general';
import TFAHelper from '../../../../helpers/tfa';

type UseContextProps = {
  error: string;
  loading: boolean;
  showChange2FAModal: boolean;
  showSuccessModal: boolean;
  tfaSecretInstance: GeneratedSecret;
  change2FA: (values: FormValuesProps) => void;
  closeChange2FAModal: () => void;
  closeSuccessModal: () => void;
  onCopy: () => void;
  openChange2FAModal: () => void;
  resetError: () => void;
};

type FormValuesProps = {
  tfaToken: string;
};

export const useContext = (): UseContextProps => {
  const [showChange2FAModal, toggleShowChange2FAModal] = useState<boolean>(
    false,
  );
  const [showSuccessModal, toggleSuccessModal] = useState<boolean>(false);
  const [loading, toggleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tfaSecretInstance, setTfaSecretInstance] = useState<GeneratedSecret>(
    null,
  );

  const closeSuccessModal = useCallback(() => {
    toggleSuccessModal(false);
  }, []);

  const closeChange2FAModal = useCallback(() => {
    toggleShowChange2FAModal(false);
  }, []);

  const openChange2FAModal = useCallback(() => {
    toggleShowChange2FAModal(true);
  }, []);

  const change2FA = useCallback(
    async (values: FormValuesProps) => {
      try {
        toggleLoading(true);
        await apis.admin.changeAdmin2FA({
          tfaSecret: tfaSecretInstance.base32,
          tfaToken: values.tfaToken,
        });
        closeChange2FAModal();
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
    [closeChange2FAModal, tfaSecretInstance?.base32],
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const onCopy = useCallback(() => {
    copyToClipboard(tfaSecretInstance?.base32);
  }, [tfaSecretInstance?.base32]);

  useEffectOnce(() => {
    const generatedTfaSecretInstance = TFAHelper.createSecret();
    setTfaSecretInstance(generatedTfaSecretInstance);
  }, []);

  return {
    error,
    loading,
    showChange2FAModal,
    showSuccessModal,
    tfaSecretInstance,
    change2FA,
    closeChange2FAModal,
    closeSuccessModal,
    onCopy,
    openChange2FAModal,
    resetError,
  };
};
