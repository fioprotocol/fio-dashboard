import React, { useEffect, useState } from 'react';

import { GeneratedSecret } from 'speakeasy';

import AdminEmailConfirmForm from './components/AdminEmailConfirmForm';
import Loader from '../../components/Loader/Loader';

import apis from '../../admin/api';
import useEffectOnce from '../../hooks/general';
import TFAHelper from '../../helpers/tfa';

import { LocationProps, PageProps, SubmitValues } from './types';

const AdminEmailConfirmPage: React.FC<PageProps & LocationProps> = props => {
  const {
    confirmAdminEmail,
    loading,
    location: { query: { hash, email } = {} },
  } = props;

  const [initialValues, setInitialValues] = useState(null);
  const [isTokenValidationLoading, setIsTokenValidationLoading] = useState(
    false,
  );
  const [tokenValidationError, setTokenValidationError] = useState(null);
  const [tfaSecretInstance, setTfaSecretInstance] = useState<GeneratedSecret>(
    null,
  );

  useEffect(() => {
    const validateData = async () => {
      setIsTokenValidationLoading(true);
      try {
        await apis.admin.checkIsAdminInvited({ hash, email });
      } catch (e) {
        setTokenValidationError(e);
      }
      setIsTokenValidationLoading(false);
    };

    if (email?.length && hash?.length) validateData();
  }, [email, hash]);

  useEffectOnce(() => {
    const generatedTfaSecretInstance = TFAHelper.createSecret();
    setTfaSecretInstance(generatedTfaSecretInstance);
    setInitialValues({
      email,
      hash,
    });
  }, []);

  const onSubmit = (values: SubmitValues) => {
    const { email, hash, password, tfaToken } = values;

    return confirmAdminEmail({
      email,
      hash,
      password,
      tfaToken,
      tfaSecret: tfaSecretInstance.base32,
    }).then(res => {
      if (res?.error?.fields) return res.error.fields;
      return null;
    });
  };

  const downloadRecovery2FaSecret = async () => {
    const qrCodeSrc = await TFAHelper.generateSrcImageDataFromSecretOtpauthUrl(
      tfaSecretInstance.otpauth_url,
    );
    return TFAHelper.downloadSecretQr(qrCodeSrc);
  };

  return (
    <div className="mt-3">
      {isTokenValidationLoading ? (
        <Loader />
      ) : (
        <>
          {!tokenValidationError ? (
            <AdminEmailConfirmForm
              onSubmit={onSubmit}
              loading={loading}
              initialValues={initialValues}
              downloadRecovery2FaSecret={downloadRecovery2FaSecret}
              tfaSecretInstance={tfaSecretInstance}
            />
          ) : (
            <div>
              <p>Token is not valid!</p>
              <p>{tokenValidationError?.code}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminEmailConfirmPage;
