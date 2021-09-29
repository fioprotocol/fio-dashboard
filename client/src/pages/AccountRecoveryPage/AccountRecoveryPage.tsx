import React, { useEffect } from 'react';

import AccountRecovery from '../../components/AccountRecovery';

type Location = {
  location: {
    query: {
      username: string;
      token: string;
    };
  };
};

type Props = {
  edgeContextSet: boolean;
  getUsersRecoveryQuestions: (token: string, username: string) => void;
};

const AccountRecoveryPage: React.FC<Location & Props> = props => {
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
