import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';

import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';

import {
  NOTIFICATIONS_CONTENT_TYPE,
  NOTIFICATIONS_CONTENT,
} from '../../constants/notifications';
import { ROUTES } from '../../constants/routes';

import { NotificationParams, LastAuthData } from '../../types';

import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';

type MatchParams = {
  hash: string;
};

type Props = {
  isAuthenticated: boolean;
  profileRefreshed: boolean;
  showLoginModal: (redirect: string) => void;
  loading: boolean;
  createNotification: (params: NotificationParams) => void;
  emailConfirmationResult: {
    error?: string;
    success?: boolean;
  };
  confirmEmail: (hash: string) => void;
  clearCachedUser: (username: string) => void;
  lastAuthData: LastAuthData;
  resetLastAuthData: () => void;
};

const UpdateEmailPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const {
    isAuthenticated,
    profileRefreshed,
    showLoginModal,
    loading,
    emailConfirmationResult,
    history,
    confirmEmail,
    match: {
      params: { hash },
    },
    clearCachedUser,
    lastAuthData,
    resetLastAuthData,
  } = props;

  useEffect(() => {
    if (profileRefreshed) confirmEmail(hash);
  }, [profileRefreshed]);

  useEffect(() => {
    if (emailConfirmationResult.success) {
      props.createNotification({
        action: ACTIONS.EMAIL_CONFIRM,
        type: BADGE_TYPES.INFO,
        contentType: NOTIFICATIONS_CONTENT_TYPE.UPDATE_EMAIL,
        pagesToShow: [
          ROUTES.CART,
          ROUTES.CHECKOUT,
          ROUTES.FIO_ADDRESSES_SELECTION,
          ROUTES.FIO_DOMAINS_SELECTION,
          ROUTES.HOME,
        ],
      });

      if (isAuthenticated) {
        history.replace(ROUTES.SETTINGS);
      } else {
        if (lastAuthData) {
          clearCachedUser(lastAuthData.username);
          resetLastAuthData();
        }
        showLoginModal(ROUTES.SETTINGS);
      }
    }
  }, [isAuthenticated, emailConfirmationResult]);

  const showLogin = () => showLoginModal(ROUTES.SETTINGS);

  if (loading || emailConfirmationResult.success == null)
    return (
      <div className={classes.container}>
        <div>
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      </div>
    );

  if (emailConfirmationResult.success === false)
    return <Redirect to={ROUTES.HOME} />;

  const renderLoginSection = () => {
    return (
      <p className="mt-3">
        Now you can to login!{' '}
        <Link to="#" onClick={showLogin}>
          Sign In
        </Link>
      </p>
    );
  };
  return (
    <div className={classes.container}>
      <div>
        <FontAwesomeIcon icon="envelope" className={classes.icon} />
        <h4 className={classes.title}>
          {NOTIFICATIONS_CONTENT.ACCOUNT_CONFIRMATION.message}
        </h4>
        {renderLoginSection()}
      </div>
    </div>
  );
};

export default UpdateEmailPage;
