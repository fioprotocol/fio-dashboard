import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RouteComponentProps } from 'react-router-dom';

type MatchParams = {
  hash: string;
};

type Props = {
  loading: boolean;
  emailConfirmationResult: { error?: string; success?: boolean };
  confirmEmail: (hash: string) => void;
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
  } = props;

  useEffect(() => {
    confirmEmail(hash);
  }, []);

  if (loading || emailConfirmationResult.success == null)
    return <FontAwesomeIcon icon="spinner" spin />;

  if (emailConfirmationResult.success === false) return null;

  return <h3>Your email is confirmed</h3>;
};

export default EmailConfirmationPage;
