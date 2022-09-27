import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RouteComponentProps } from 'react-router-dom';

import { AnyObject, EmailConfirmationResult } from '../../types';

import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';

export type LocationProps = {
  location: {
    query: {
      hash?: string;
      refCode?: string;
    };
  };
};

type Props = {
  profileRefreshed: boolean;
  emailConfirmationResult: EmailConfirmationResult;
  confirmEmail: (hash: string) => Promise<AnyObject>;
  getInfo: (refCode: string) => void;
};

const EmailConfirmationPage: React.FC<Props &
  RouteComponentProps &
  LocationProps> = props => {
  const {
    profileRefreshed,
    emailConfirmationResult,
    location: { query: { hash, refCode } = {} },
    history,
    getInfo,
    confirmEmail,
  } = props;
  const [confirmRequested, setConfirmRequested] = useState<boolean>(false);
  const isNotConfirmedEmail =
    typeof emailConfirmationResult.success === 'undefined';

  useEffect(() => {
    if (refCode != null && refCode !== '') {
      getInfo(refCode);
    }
  }, [refCode, getInfo]);

  useEffect(() => {
    if (profileRefreshed && isNotConfirmedEmail && !confirmRequested) {
      setConfirmRequested(true);
      confirmEmail(hash);
    }
  }, [
    profileRefreshed,
    isNotConfirmedEmail,
    confirmRequested,
    confirmEmail,
    hash,
    history,
  ]);

  return (
    <div className={classes.container}>
      <div>
        <FontAwesomeIcon icon="spinner" spin />
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
