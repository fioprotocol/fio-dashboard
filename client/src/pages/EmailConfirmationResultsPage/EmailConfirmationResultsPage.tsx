import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RouterProps } from 'react-router';
import { History } from 'history';

import { Button } from 'react-bootstrap';

import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { NOTIFICATIONS_CONTENT_TYPE } from '../../constants/notifications';

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
    emailConfirmationResult,
    resetEmailConfirmationResult,
    createNotification,
  } = props;

  const emailConfirmed =
    emailConfirmationResult && emailConfirmationResult.success;
  const handleClosePage = () => window.close();

  const handleResult = () => {
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
        ROUTES.DASHBOARD,
      ],
    });
  };

  useEffect(() => {
    if (emailConfirmed) {
      handleResult();
    }
  }, [emailConfirmed, handleResult]);

  useEffectOnce(() => () => resetEmailConfirmationResult(), []);

  if (!emailConfirmed) return null;

  return (
    <>
      <div className={classes.confirmBackground} />
      <div className={classes.actionModal}>
        <div className={classes.closeIcon} onClick={handleClosePage}>
          ×
        </div>
        <div className="d-flex justify-content-center my-4">
          <FontAwesomeIcon icon="list-alt" className={classes.listIcon} />
        </div>
        <div className={classes.title}>Close Window</div>
        <div className={classes.infoText}>
          An email has been confirmed. You can close this window now.
        </div>
        <Button
          onClick={handleClosePage}
          variant="outline-primary"
          size="lg"
          className={classes.closeButton}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default EmailConfirmationResultsPage;
