import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

import { User } from '../../types';

import classes from './UpdateEmailConfirmGatePage.module.scss';

type Props = {
  newEmail: string;
  updateEmailRevert: () => void;
  user: User;
  noProfileLoaded: boolean;
  isActiveUser: boolean;
  isAuthenticated: boolean;
};

const UpdateEmailConfirmGatePage: React.FC<Props &
  RouteComponentProps> = props => {
  const {
    updateEmailRevert,
    user,
    noProfileLoaded,
    isActiveUser,
    isAuthenticated,
    history,
  } = props;

  useEffect(() => {
    if (isAuthenticated && isActiveUser) {
      history.replace(ROUTES.SETTINGS);
    }

    if (!isAuthenticated) {
      history.replace(ROUTES.HOME);
    }
  }, [isAuthenticated, isActiveUser]);

  if (noProfileLoaded)
    return (
      <Redirect
        to={{
          pathname: ROUTES.HOME,
        }}
      />
    );

  if (isActiveUser)
    return (
      <Redirect
        to={{
          pathname: ROUTES.SETTINGS,
        }}
      />
    );

  if (user != null) {
    const onClick = () => updateEmailRevert();

    return (
      <div className={classes.container}>
        <div className={classes.messageContainer}>
          <FontAwesomeIcon icon="envelope" className={classes.icon} />
          <h4 className={classes.title}>Please Verify Your Email</h4>
          <p className={classes.subtitle}>
            An email has been sent to the following email address.
          </p>
          <p className={classes.email}>{user.newEmail || ''}</p>
          <p className={classes.subtitle}>
            Please verify the change in order to access the FIO Dashboard
          </p>
          <div className={classes.actionContainer}>
            <p className={classes.text}>Incorrect email address? </p>
            <button onClick={onClick} className={classes.actionButton}>
              Revert to Original
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <FontAwesomeIcon icon="spinner" spin className={classes.loader} />;
};

export default UpdateEmailConfirmGatePage;
