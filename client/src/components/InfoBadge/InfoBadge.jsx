import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge from '../Badge/Badge';
import classes from './InfoBadge.module.scss';

const InfoBadge = props => {
  const { title, type, show, message } = props;
  return (
    <Badge type={type} show={show}>
      <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
      <p>
        <span className={classes.title}>{title}</span> - {message}
      </p>
    </Badge>
  );
};

export default InfoBadge;
