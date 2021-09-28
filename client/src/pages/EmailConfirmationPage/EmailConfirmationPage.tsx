import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, RouteComponentProps } from 'react-router-dom';
import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';
import { ROUTES } from '../../constants/routes';

type MatchParams = {
  hash: string;
};

type Props = {
  loading: boolean;
  emailConfirmationResult: { error?: string; success?: boolean };
  confirmEmail: (hash: string) => void;
  showLoginModal: (redirect: string) => void;
};

const EmailConfirmationPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const {
    loading,
    confirmEmail,
    emailConfirmationResult,
    match: {
      params: { hash },
    },
    showLoginModal,
  } = props;

  useEffect(() => {
    confirmEmail(hash);
  }, []);

  const showLogin = () => {
    showLoginModal(ROUTES.HOME);
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

  return (
    <div className={classes.container}>
      <div>
        <FontAwesomeIcon icon="envelope" className={classes.icon} />
        <h4 className={classes.title}>Your email is confirmed</h4>
        <p className="mt-3">
          Now you can to login!{' '}
          <Link to="#" onClick={showLogin}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
