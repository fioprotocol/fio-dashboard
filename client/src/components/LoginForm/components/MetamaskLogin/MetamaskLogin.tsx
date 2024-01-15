import React from 'react';

import SubmitButton from '../../../common/SubmitButton/SubmitButton';

import { useContext } from './MetamaskLoginContext';

export const MetamaskLogin: React.FC = () => {
  const { connectMetamask } = useContext();

  return (
    <div>
      <SubmitButton text="Sign in with metamask" onClick={connectMetamask} />
    </div>
  );
};
