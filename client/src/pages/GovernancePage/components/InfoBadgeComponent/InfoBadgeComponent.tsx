import React from 'react';
import classnames from 'classnames';

import InfoBadge from '../../../../components/InfoBadge/InfoBadge';

import classes from './InfoBadgeComponent.module.scss';

type Props = {
  className?: string;
  message: string | React.ReactElement;
  title: string;
  type: string;
};

export const InfoBadgeComponent: React.FC<Props> = ({
  className,
  message,
  title,
  type,
}) => (
  <InfoBadge
    className={classnames(classes.infoBadge, className)}
    type={type}
    show
    title={title}
    message={message}
  />
);
