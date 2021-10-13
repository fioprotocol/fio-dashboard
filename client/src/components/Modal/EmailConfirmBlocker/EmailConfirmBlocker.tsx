import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from '../EmailModal/EmailModal.module.scss';

import {
  EmailConfirmationStateData,
  RefProfile,
  RefQuery,
} from '../../../types';
import { useHistory } from 'react-router';
import { ROUTES } from '../../../constants/routes';

type Props = {
  loading: boolean;
  isAuthenticated: boolean;
  isActiveUser: boolean;
  emailConfirmationToken: string;
  emailConfirmationSent: boolean;
  resendConfirmEmail: (
    token: string,
    stateData: EmailConfirmationStateData,
  ) => void;
  isRefFlow: boolean;
  refProfileInfo: RefProfile | null;
  refProfileQueryParams: RefQuery | null;
  redirectLink: string;
};

const EmailConfirmBlocker: React.FC<Props> = props => {
  const {
    isAuthenticated,
    isActiveUser,
    emailConfirmationToken,
    emailConfirmationSent,
    loading,
    refProfileQueryParams,
    refProfileInfo,
    isRefFlow,
    redirectLink,
    resendConfirmEmail,
  } = props;

  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated && isActiveUser) {
      history.replace(redirectLink);
    }

    if (!isAuthenticated) {
      history.replace(ROUTES.HOME);
    }
  }, [isAuthenticated, isActiveUser]);

  const onSend = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    let stateData: EmailConfirmationStateData = {
      redirectLink,
    };
    if (isRefFlow) {
      stateData = {
        ...stateData,
        refCode: refProfileInfo.code,
        refProfileQueryParams,
      };
    }
    resendConfirmEmail(emailConfirmationToken, stateData);
  };

  return (
    <div className={classes.container}>
      <div>
        <FontAwesomeIcon icon="envelope" className={classes.icon} />
        <h4 className={classes.title}>Please Verify Your Email</h4>
        <p className={classes.subtitle}>
          Before you complete access to the FIO Dashboard you must verify your
          email address.
        </p>
        {loading ? (
          <p className={classes.footer}>
            <FontAwesomeIcon icon="spinner" spin />
          </p>
        ) : (
          <p className={classes.footer}>
            Didn't get an email?{' '}
            <a href="#" onClick={onSend} className={classes.sendLink}>
              Send Again
            </a>
          </p>
        )}
        <p className="mt-0 mb-0">
          {emailConfirmationSent ? 'Email sent' : ''}&nbsp;
        </p>
      </div>
    </div>
  );
};

export default EmailConfirmBlocker;
