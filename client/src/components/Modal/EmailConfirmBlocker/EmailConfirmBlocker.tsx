import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from '../EmailModal/EmailModal.module.scss';

import {
  EmailConfirmationStateData,
  RedirectLinkData,
  RefProfile,
  ContainedFlowQueryParams,
} from '../../../types';
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
  isContainedFlow: boolean;
  refProfileInfo: RefProfile | null;
  containedFlowQueryParams?: ContainedFlowQueryParams | null;
  redirectLink: RedirectLinkData;
  setRedirectPath: (path: string | null) => void;
};

const EmailConfirmBlocker: React.FC<Props> = props => {
  const {
    isAuthenticated,
    isActiveUser,
    emailConfirmationToken,
    emailConfirmationSent,
    loading,
    containedFlowQueryParams,
    refProfileInfo,
    isContainedFlow,
    redirectLink,
    resendConfirmEmail,
    setRedirectPath,
  } = props;

  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated && isActiveUser) {
      const { pathname, state: redirectState } = redirectLink || {};
      history.replace(pathname || ROUTES.HOME, redirectState);
      setRedirectPath(null);
    }

    if (!isAuthenticated) {
      history.replace(ROUTES.HOME);
    }
  }, [isAuthenticated, isActiveUser, redirectLink]);

  const onSend = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    let stateData: EmailConfirmationStateData = {
      redirectLink: redirectLink ? redirectLink.pathname : '',
    };
    if (isContainedFlow) {
      stateData = {
        ...stateData,
        refCode: refProfileInfo?.code,
        containedFlowQueryParams,
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
            <span onClick={onSend} className={classes.sendLink}>
              Send Again
            </span>
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
