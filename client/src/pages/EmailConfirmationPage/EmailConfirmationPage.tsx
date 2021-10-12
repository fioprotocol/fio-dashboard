import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, RouteComponentProps } from 'react-router-dom';
import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';
import { ROUTES } from '../../constants/routes';
import { EmailConfirmationStateData } from '../../types';

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
  emailConfirmationResult: {
    error?: string;
    success?: boolean;
    stateData: EmailConfirmationStateData;
  };
  confirmEmail: (hash: string) => void;
  getInfo: (refCode: string) => void;
  showLoginModal: (redirect: string) => void;
};

const EmailConfirmationPage: React.FC<Props &
  RouteComponentProps<MatchParams> &
  Location> = props => {
  const {
    loading,
    confirmEmail,
    emailConfirmationResult,
    match: {
      params: { hash },
    },
    location: { query },
    showLoginModal,
    getInfo,
  } = props;

  useEffect(() => {
    confirmEmail(hash);
    if (query != null && query.refCode != null && query.refCode !== '') {
      getInfo(query.refCode);
    }
  }, []);

  useEffect(() => {
    if (
      emailConfirmationResult.success &&
      emailConfirmationResult.stateData != null &&
      emailConfirmationResult.stateData.refProfileQueryParams != null
    ) {
      showLoginModal(ROUTES.CHECKOUT);
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
        <h4 className={classes.title}>Your email is confirmed</h4>
        {renderLoginSection()}
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
