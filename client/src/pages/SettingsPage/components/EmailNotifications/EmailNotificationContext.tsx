import { useCallback, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { log } from '../../../../util/general';
import apis from '../../../../api';

import { loadProfile } from '../../../../redux/profile/actions';

import { user as userSelector } from '../../../../redux/profile/selectors';

import {
  EmailNotificationParamsNamesType,
  EmailNotificationParamsType,
} from '../../../../types';

type EmailNotificationParams = {
  [key: string]: {
    title: string;
  };
};

type UseContextProps = {
  disableConfigs: boolean;
  emailNotificationParams: EmailNotificationParamsType;
  hasError: boolean;
  loading: boolean;
  showSuccessModal: boolean;
  onSuccessClose: () => void;
  toggleCheckClick: (
    emailNotificationType: EmailNotificationParamsNamesType,
  ) => void;
  updateEmailNotification: () => void;
};

export const EMAIL_NOTIFICATION_PARAMS: EmailNotificationParams = {
  fioDomainExpiration: {
    title: 'FIO Domain Expiration',
  },
  fioRequest: {
    title: 'FIO Requests',
  },
  fioBalanceChange: {
    title: 'FIO Balance Change',
  },
  lowBundles: {
    title: 'Low Bundles',
  },
};

export const useContext = (): UseContextProps => {
  const user = useSelector(userSelector);
  const [emailNotificationParams, setEmailNotificationParams] = useState<
    EmailNotificationParamsType
  >(user.emailNotificationParams);
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessModal, toggleSuccessModal] = useState<boolean>(false);

  const dispatch = useDispatch();

  const toggleCheckClick = useCallback(
    (emailNotificationType: EmailNotificationParamsNamesType) => {
      setEmailNotificationParams(prevValue => {
        const currentValue: boolean =
          prevValue[emailNotificationType as keyof EmailNotificationParamsType];

        return {
          ...prevValue,
          [emailNotificationType]: !currentValue,
        };
      });
    },
    [],
  );

  const updateEmailNotification = useCallback(async () => {
    setLoading(true);

    try {
      const updateNotificationsRes = await apis.users.updateEmailNotifications(
        emailNotificationParams,
      );

      if (updateNotificationsRes?.success) {
        toggleSuccessModal(true);
        dispatch(loadProfile());
      }
      hasError && setHasError(false);
    } catch (err) {
      log.error(err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [dispatch, emailNotificationParams, hasError]);

  const onSuccessClose = useCallback(() => toggleSuccessModal(false), []);

  return {
    emailNotificationParams,
    disableConfigs: !user?.email,
    hasError,
    loading,
    showSuccessModal,
    onSuccessClose,
    toggleCheckClick,
    updateEmailNotification,
  };
};
