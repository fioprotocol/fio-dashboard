import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from './ExclamationIcon.module.scss';

type Props = {
  isBlackWhite?: boolean;
  isWhiteIndigo?: boolean;
};

export const ExclamationIcon: React.FC<Props> = props => {
  const { isBlackWhite, isWhiteIndigo } = props;

  return (
    <div
      className={classnames(
        classes.container,
        isBlackWhite && classes.isBlackWhite,
        isWhiteIndigo && classes.isWhiteIndigo,
      )}
    >
      <FontAwesomeIcon icon="certificate" className={classes.icon} />
      <FontAwesomeIcon icon="exclamation" className={classes.insideIcon} />
    </div>
  );
};
