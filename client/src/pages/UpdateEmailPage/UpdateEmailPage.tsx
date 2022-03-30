import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';
import { RouterProps } from 'react-router';

import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import Processing from '../../components/common/TransactionProcessing';

import {
  NOTIFICATIONS_CONTENT_TYPE,
  NOTIFICATIONS_CONTENT,
} from '../../constants/notifications';
import { ROUTES } from '../../constants/routes';

import {
  NotificationParams,
  LastAuthData,
  EmailConfirmationResult,
  User,
} from '../../types';

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
  emailConfirmationResult: EmailConfirmationResult;
  updateEmail: (hash: string) => void;
  user: User;
  lastAuthData: LastAuthData;
  resetLastAuthData: () => void;
  updateEmailLoading: boolean;
  logout: (routerProps: RouterProps) => void;
  resetEmailConfirmationResult: () => void;
  updateStateEmail: (email: string) => void;
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
    updateEmail,
    match: {
      params: { hash },
    },
    user,
    lastAuthData,
    logout,
    resetLastAuthData,
    resetEmailConfirmationResult,
    updateStateEmail,
    updateEmailLoading,
  } = props;

  const handleResult = (result: EmailConfirmationResult) => {
    props.createNotification({
      action: ACTIONS.EMAIL_CONFIRM,
      type: BADGE_TYPES.INFO,
      contentType: NOTIFICATIONS_CONTENT_TYPE.UPDATE_EMAIL,
      pagesToShow: [ROUTES.HOME, ROUTES.SETTINGS],
    });

    if (isAuthenticated && user.email === result.oldEmail && result.newEmail) {
      updateStateEmail(result.newEmail);
      return history.replace(ROUTES.SETTINGS);
    }

    if (isAuthenticated) {
      logout({ history });
    }

    if (lastAuthData) {
      resetLastAuthData();
    }
    showLoginModal(ROUTES.SETTINGS);
  };

  useEffect(() => () => resetEmailConfirmationResult(), []);
  useEffect(() => {
    if (profileRefreshed) updateEmail(hash);
  }, [profileRefreshed]);

  useEffect(() => {
    if (emailConfirmationResult.success) {
      handleResult(emailConfirmationResult);
    }
  }, [emailConfirmationResult]);

  const showLogin = () => showLoginModal(ROUTES.SETTINGS);

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
    <>
      {!loading && !updateEmailLoading && (
        <div className={classes.container}>
          <div>
            <FontAwesomeIcon icon="envelope" className={classes.icon} />
            <h4 className={classes.title}>
              {NOTIFICATIONS_CONTENT.ACCOUNT_CONFIRMATION.message}
            </h4>
            {renderLoginSection()}
          </div>
        </div>
      )}
      <Processing
        title="Confirming Email"
        message="Hang tight while we are confirming your new email"
        isProcessing={
          updateEmailLoading || emailConfirmationResult.success == null
        }
      />
    </>
  );
};

export default UpdateEmailPage;
