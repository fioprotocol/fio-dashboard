import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from './InfoBadge.module.scss';

type Props = {
  title: string;
  message: string;
  isOrange?: boolean;
};

const InfoBadge: React.FC<Props> = props => {
  const { title, message, isOrange } = props;
  return (
    <div
      className={classnames(classes.infoBadge, isOrange && classes.isOrange)}
    >
      <FontAwesomeIcon icon="exclamation-circle" className={classes.infoIcon} />
      <h5 className={classes.infoTitle}>{title}</h5>
      <p className={classes.infoText}>{message}</p>
    </div>
  );
};

export default InfoBadge;
