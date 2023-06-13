import React from 'react';

import Badge, { BADGE_TYPES } from '../Badge/Badge';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import { ROUTES } from '../../constants/routes';

import { transformBaseUrl } from '../../util/general';

import FioLogoSrc from '../../assets/images/fio-logo.svg';

import classes from './FioProfileActionBadge.module.scss';

export const FioProfileActionBadge: React.FC = () => {
  const transformedBaseUrl = transformBaseUrl();

  return (
    <Badge show type={BADGE_TYPES.WHITE} className={classes.badge}>
      <a href={transformedBaseUrl} target="_blank" rel="noopener noreferrer">
        <img src={FioLogoSrc} alt="FIO Logo" className={classes.logo} />
      </a>
      <div className={classes.actionButtonsContainer}>
        <a
          href={transformedBaseUrl + ROUTES.FIO_ADDRESSES_SELECTION}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SubmitButton
            text="Get Your Own FIO Handle"
            isButtonType
            isWhiteViolet
            className={classes.button}
          />
        </a>
        <a
          href={transformedBaseUrl + ROUTES.DASHBOARD}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SubmitButton
            text="Manage Your FIO Handle"
            isButtonType
            className={classes.button}
          />
        </a>
      </div>
    </Badge>
  );
};
