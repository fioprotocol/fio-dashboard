import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

import { loading as profileLoadingSelector } from '../../redux/profile/selectors';
import { resetAdminPassword } from '../../redux/profile/actions';

import apis from '../../admin/api';
import useEffectOnce from '../../hooks/general';

import { SubmitValues } from './types';
import { AnyObject } from '../../types';

export const useContext = (): {
  isProfileLoading: boolean;
  isTokenValidationLoading: boolean;
  onSubmit: (values: SubmitValues) => Promise<AnyObject>;
  initialValues: { email: string; hash: string } | null;
  tokenValidationError: AnyObject;
} => {
  const dispatch = useDispatch();
  const isProfileLoading = useSelector(profileLoadingSelector);

  const {
    // @ts-ignore // todo: research, mb update "react-router"
    query: { email, hash },
  } = useLocation();

  const [initialValues, setInitialValues] = useState(null);
  const [isTokenValidationLoading, setIsTokenValidationLoading] = useState(
    false,
  );
  const [tokenValidationError, setTokenValidationError] = useState(null);

  useEffect(() => {
    const validateData = async () => {
      setIsTokenValidationLoading(true);
      try {
        await apis.admin.checkIsAdminPasswordResetSuccess({ hash, email });
      } catch (e) {
        setTokenValidationError(e);
      }
      setIsTokenValidationLoading(false);
    };

    if (email?.length && hash?.length) validateData();
  }, [email, hash]);

  useEffectOnce(() => {
    setInitialValues({
      email,
      hash,
    });
  }, []);

  const onSubmit = async (values: SubmitValues) => {
    const { email, hash, password } = values;

    const result = await dispatch(
      resetAdminPassword({
        email,
        hash,
        password,
      }),
    );

    if (result?.error?.fields) {
      return result.error.fields;
    }

    return null;
  };

  return {
    isProfileLoading,
    isTokenValidationLoading,
    onSubmit,
    initialValues,
    tokenValidationError,
  };
};
