import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useContext } from './EmailConfirmationPageContext';

import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';

export type LocationProps = {
  location: {
    query: {
      hash?: string;
      refCode?: string;
    };
  };
};

const EmailConfirmationPage: React.FC = () => {
  useContext();

  return (
    <div className={classes.container}>
      <div>
        <FontAwesomeIcon icon="spinner" spin />
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
