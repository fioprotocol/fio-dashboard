import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { RouterProps } from 'react-router';
import { History } from 'history';

import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  NOTIFICATIONS_CONTENT_TYPE,
  NOTIFICATIONS_CONTENT,
} from '../../constants/notifications';

import {
  NotificationParams,
  CartItem,
  EmailConfirmationResult,
  LastAuthData,
  User,
} from '../../types';

import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';
import useEffectOnce from '../../hooks/general';

type Props = {
  isAuthenticated: boolean;
  user: User;
  lastAuthData: LastAuthData;
  cartItems: CartItem[];
  emailConfirmationResult: EmailConfirmationResult;
  history: History;
  showLoginModal: (redirect: string) => void;
  createNotification: (params: NotificationParams) => void;
  logout: (routerProps: RouterProps) => void;
  resetLastAuthData: () => void;
  resetEmailConfirmationResult: () => void;
};

const EmailConfirmationResultsPage: React.FC<Props> = props => {
  const {
    isAuthenticated,
    user,
    lastAuthData,
    emailConfirmationResult,
    cartItems,
    history,
    showLoginModal,
    logout,
    resetLastAuthData,
    resetEmailConfirmationResult,
    createNotification,
  } = props;

  const handleResult = (result: EmailConfirmationResult) => {
    createNotification({
      action: ACTIONS.EMAIL_CONFIRM,
      type: BADGE_TYPES.INFO,
      contentType: NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CONFIRMATION,
      pagesToShow: [
        ROUTES.CART,
        ROUTES.CHECKOUT,
        ROUTES.FIO_ADDRESSES_SELECTION,
        ROUTES.FIO_DOMAINS_SELECTION,
        ROUTES.HOME,
      ],
    });

    let redirectLink = ROUTES.HOME;
    if (
      result.stateData != null &&
      result.stateData.containedFlowQueryParams != null
    )
      redirectLink = ROUTES.CHECKOUT;

    if (result.stateData != null && result.stateData.redirectLink)
      redirectLink = result.stateData.redirectLink;

    if (redirectLink === ROUTES.CHECKOUT && cartItems.length === 0)
      redirectLink = ROUTES.CART;

    if (isAuthenticated && user.email === result.email) {
      return history.replace(redirectLink);
    }
    if (isAuthenticated) {
      logout({ history });
    }
    if (lastAuthData && lastAuthData.email !== result.email) {
      resetLastAuthData();
    }

    showLoginModal(redirectLink);
  };

  useEffect(() => {
    if (emailConfirmationResult.success) {
      handleResult(emailConfirmationResult);
    }
  }, [emailConfirmationResult]);

  useEffectOnce(() => () => resetEmailConfirmationResult(), []);

  const showLogin = () => {
    let redirectLink = ROUTES.HOME;
    if (
      emailConfirmationResult &&
      emailConfirmationResult.success &&
      emailConfirmationResult.stateData != null &&
      emailConfirmationResult.stateData.redirectLink
    )
      redirectLink = emailConfirmationResult.stateData.redirectLink;

    showLoginModal(redirectLink);
  };

  if (emailConfirmationResult.success === false) return null;

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

export default EmailConfirmationResultsPage;
