import React, { useEffect, useState } from 'react';
import { RouterProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, RouteComponentProps } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  NOTIFICATIONS_CONTENT_TYPE,
  NOTIFICATIONS_CONTENT,
} from '../../constants/notifications';

import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';

import {
  NotificationParams,
  CartItem,
  EmailConfirmationResult,
  LastAuthData,
  User,
} from '../../types';

type MatchParams = {
  hash: string;
};

type Location = {
  location: {
    query: {
      refCode?: string;
    };
  };
};

type Props = {
  loading: boolean;
  isAuthenticated: boolean;
  profileRefreshed: boolean;
  user: User;
  lastAuthData: LastAuthData;
  cartItems: CartItem[];
  emailConfirmationResult: EmailConfirmationResult;
  confirmEmail: (hash: string) => void;
  getInfo: (refCode: string) => void;
  showLoginModal: (redirect: string) => void;
  createNotification: (params: NotificationParams) => void;
  logout: (routerProps: RouterProps) => void;
  resetLastAuthData: () => void;
  resetEmailConfirmationResult: () => void;
};

const EmailConfirmationPage: React.FC<Props &
  RouteComponentProps<MatchParams> &
  Location> = props => {
  const {
    loading,
    confirmEmail,
    isAuthenticated,
    profileRefreshed,
    user,
    lastAuthData,
    emailConfirmationResult,
    match: {
      params: { hash },
    },
    location: { query },
    history,
    showLoginModal,
    logout,
    resetLastAuthData,
    resetEmailConfirmationResult,
    getInfo,
    cartItems,
  } = props;

  const [confirmRequested, setConfirmRequested] = useState<boolean>(false);

  const handleResult = (result: EmailConfirmationResult) => {
    props.createNotification({
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
    if (query != null && query.refCode != null && query.refCode !== '') {
      getInfo(query.refCode);
    }

    return () => resetEmailConfirmationResult();
  }, []);

  useEffect(() => {
    if (
      profileRefreshed &&
      typeof emailConfirmationResult.success === 'undefined' &&
      !confirmRequested
    ) {
      setConfirmRequested(true);
      confirmEmail(hash);
    }
  }, [profileRefreshed, emailConfirmationResult]);

  useEffect(() => {
    if (emailConfirmationResult.success) {
      handleResult(emailConfirmationResult);
    }
  }, [emailConfirmationResult]);

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

  if (loading || emailConfirmationResult.success == null)
    return (
      <div className={classes.container}>
        <div>
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      </div>
    );

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

export default EmailConfirmationPage;
