import React from 'react';

import Badge, { BADGE_TYPES } from '../Badge/Badge';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import { ROUTES } from '../../constants/routes';

import FioLogoSrc from '../../assets/images/fio-logo.svg';

import classes from './FioProfileActionBadge.module.scss';

export const ACTION_BUTTONS_NAMES: {
  [key: string]:
    | 'GET_FIO_HANDLE'
    | 'MANAGE_FIO_HANDLE'
    | 'LEARN_MORE_ABOUT_FIO';
} = {
  GET_FIO_HANDLE: 'GET_FIO_HANDLE',
  MANAGE_FIO_HANDLE: 'MANAGE_FIO_HANDLE',
  LEARN_MORE_ABOUT_FIO: 'LEARN_MORE_ABOUT_FIO',
};

const ACTION_BUTTONS_CONTENT = {
  [ACTION_BUTTONS_NAMES.GET_FIO_HANDLE]: {
    addFioBaseUrl: true,
    buttonProps: {
      isWhiteViolet: true,
      text: 'Get Your Own FIO Handle',
    },
    link: ROUTES.FIO_ADDRESSES_SELECTION,
  },
  [ACTION_BUTTONS_NAMES.MANAGE_FIO_HANDLE]: {
    addFioBaseUrl: true,
    buttonProps: {
      text: 'Manage Your FIO Handle',
    },
    link: ROUTES.DASHBOARD,
  },
  [ACTION_BUTTONS_NAMES.LEARN_MORE_ABOUT_FIO]: {
    buttonProps: {
      isWhiteViolet: true,
      text: 'Learn More About FIO',
    },
    link: 'https://www.fioprotocol.io/',
  },
};

type ActionButtonType = keyof typeof ACTION_BUTTONS_NAMES;

type Props = {
  actionButtons: ActionButtonType[];
  fioBaseUrl: string;
};

export const FioProfileActionBadge: React.FC<Props> = props => {
  const { actionButtons, fioBaseUrl } = props;

  return (
    <Badge show type={BADGE_TYPES.WHITE} className={classes.badge}>
      <a href={fioBaseUrl} target="_blank" rel="noopener noreferrer">
        <img src={FioLogoSrc} alt="FIO Logo" className={classes.logo} />
      </a>
      <div className={classes.actionButtonsContainer}>
        {actionButtons.map(actionButton => {
          const { addFioBaseUrl, buttonProps, link } = ACTION_BUTTONS_CONTENT[
            actionButton
          ];

          const linkTo = addFioBaseUrl ? fioBaseUrl + link : link;

          return (
            <a href={linkTo} target="_blank" rel="noopener noreferrer">
              <SubmitButton {...buttonProps} className={classes.button} />
            </a>
          );
        })}
      </div>
    </Badge>
  );
};
