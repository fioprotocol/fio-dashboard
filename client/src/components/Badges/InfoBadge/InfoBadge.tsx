import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './InfoBadge.module.scss';

type Props = {
  title: string;
  message: string;
};

const InfoBadge: React.FC<Props> = props => {
  const { title, message } = props;
  return (
    <div className={classes.infoBadge}>
      <FontAwesomeIcon icon="exclamation-circle" className={classes.infoIcon} />
      <h5 className={classes.infoTitle}>{title}</h5>
      <p className={classes.infoText}>{message}</p>
    </div>
  );
};

export default InfoBadge;
