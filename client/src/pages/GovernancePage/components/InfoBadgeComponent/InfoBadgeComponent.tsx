import React from 'react';

import InfoBadge from '../../../../components/InfoBadge/InfoBadge';

import classes from './InfoBadgeComponent.module.scss';

type Props = {
  message: string | React.ReactElement;
  title: string;
  type: string;
};

export const InfoBadgeComponent: React.FC<Props> = ({
  message,
  title,
  type,
}) => (
  <InfoBadge
    className={classes.infoBadge}
    type={type}
    show
    title={title}
    message={message}
  />
);
