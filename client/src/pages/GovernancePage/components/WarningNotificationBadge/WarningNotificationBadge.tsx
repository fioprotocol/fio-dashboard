import React from 'react';

import NotificationBadge from '../../../../components/NotificationBadge';

import classes from './WarningNotificationBadge.module.scss';

type Props = {
  message: string | React.ReactElement;
  show: boolean;
  title: string;
  type: string;
};

export const WarningNotificationBadge: React.FC<Props> = props => {
  const { message, show, title, type } = props;

  return (
    <NotificationBadge
      show={show}
      title={title}
      type={type}
      message={message}
      className={classes.container}
    />
  );
};
