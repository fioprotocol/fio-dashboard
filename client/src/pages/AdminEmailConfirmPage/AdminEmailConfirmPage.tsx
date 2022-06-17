import React, { useEffect } from 'react';

import { RouteComponentProps } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';

type MatchParams = {
  hash: string;
};

type Props = {
  confirmAdminEmail: (hash: string) => void;
};

const AdminEmailConfirmPage: React.FC<Props &
  RouteComponentProps<MatchParams>> = props => {
  const {
    match: {
      params: { hash },
    },
    confirmAdminEmail,
  } = props;

  useEffect(() => {
    confirmAdminEmail(hash);
  }, [hash, confirmAdminEmail]);

  return (
    <div className={classes.container}>
      <div>
        <FontAwesomeIcon icon="envelope" className={classes.icon} />
        <h4 className={classes.title}>Confirming your email</h4>
      </div>
    </div>
  );
};

export default AdminEmailConfirmPage;
