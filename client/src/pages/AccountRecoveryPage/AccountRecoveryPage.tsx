import React, { useEffect } from 'react';

import AccountRecovery from '../../components/AccountRecovery';

type Props = {
  edgeContextSet: boolean;
  getUsersRecoveryQuestions: (username: string) => void;
};

const AccountRecoveryPage: React.FC<any & Props> = props => {
  const { getUsersRecoveryQuestions, edgeContextSet, location } = props;
  const {
    query: { username: usernameProp, token: tokenProp },
  } = location;

  useEffect(() => {
    if (edgeContextSet) getUsersRecoveryQuestions(tokenProp, usernameProp);
  }, [edgeContextSet]);

  return (
    <AccountRecovery {...props} token={tokenProp} username={usernameProp} />
  );
};

export default AccountRecoveryPage;
