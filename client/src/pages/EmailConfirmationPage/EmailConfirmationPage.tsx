import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, RouteComponentProps } from 'react-router-dom';
import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';
import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  NotificationParams,
  CartItem,
  EmailConfirmationStateData,
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
  cartItems: CartItem[];
  emailConfirmationResult: {
    error?: string;
    success?: boolean;
    stateData: EmailConfirmationStateData;
  };
  confirmEmail: (hash: string) => void;
  getInfo: (refCode: string) => void;
  showLoginModal: (redirect: string) => void;
  createNotification: (params: NotificationParams) => void;
};

const EmailConfirmationPage: React.FC<Props &
  RouteComponentProps<MatchParams> &
  Location> = props => {
  const {
    loading,
    confirmEmail,
    isAuthenticated,
    profileRefreshed,
    emailConfirmationResult,
    match: {
      params: { hash },
    },
    location: { query },
    history,
    showLoginModal,
    getInfo,
    cartItems,
  } = props;

  useEffect(() => {
    if (query != null && query.refCode != null && query.refCode !== '') {
      getInfo(query.refCode);
    }
  }, []);

  useEffect(() => {
    if (profileRefreshed) confirmEmail(hash);
  }, [profileRefreshed]);

  useEffect(() => {
    if (emailConfirmationResult.success) {
      props.createNotification({
        action: ACTIONS.EMAIL_CONFIRM,
        type: BADGE_TYPES.INFO,
        title: 'Account Confirmation',
        message: 'Your email is confirmed',
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
        emailConfirmationResult.stateData != null &&
        emailConfirmationResult.stateData.refProfileQueryParams != null
      )
        redirectLink = ROUTES.CHECKOUT;

      if (
        emailConfirmationResult.stateData != null &&
        emailConfirmationResult.stateData.redirectLink
      )
        redirectLink = emailConfirmationResult.stateData.redirectLink;

      if (redirectLink === ROUTES.CHECKOUT && cartItems.length === 0)
        redirectLink = ROUTES.CART;

      if (isAuthenticated) {
        history.replace(redirectLink);
      } else {
        showLoginModal(redirectLink);
      }
    }
  }, [isAuthenticated, emailConfirmationResult]);

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
        <h4 className={classes.title}>Your email is confirmed</h4>
        {renderLoginSection()}
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
