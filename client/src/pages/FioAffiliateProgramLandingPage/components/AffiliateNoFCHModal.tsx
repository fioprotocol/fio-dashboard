import React from 'react';
import { Link } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';

import { ROUTES } from '../../../constants/routes';

import classes from '../styles/AffiliateModal.module.scss';

export const AffiliateNoFCHModal: React.FC = () => {
  return (
    <div className={classes.container}>
      <InfoOutlinedIcon className={classes.icon} />
      <h4 className={classes.title}>Missing FIO Handle</h4>
      <p className={classes.subtitle}>
        To complete your activation, you will need a FIO Handle to receive all
        your rewards.
      </p>
      <Link to={ROUTES.FIO_ADDRESSES_SELECTION}>
        <SubmitButton
          className={classes.button}
          text="Get a FREE FIO Handle Now"
        />
      </Link>
    </div>
  );
};
