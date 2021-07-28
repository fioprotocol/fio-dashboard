import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import classes from './LowBalanceBadge.module.scss';

type Props = {
  hasLowBalance: boolean;
  buttonText: string;
  messageText: string;
};

const LowBalanceBadge: React.FC<Props> = props => {
  const { buttonText, messageText, hasLowBalance } = props;
  if (!hasLowBalance) return null;
  return (
    <Badge type={BADGE_TYPES.ERROR} show={true}>
      <div className={classes.errorContainer}>
        <div className={classes.textContainer}>
          <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
          <p className={classes.text}>
            <span className="boldText">Low Balance!</span> - {messageText}
          </p>
        </div>
        <Button
          className={classes.button}
          onClick={() => {
            //todo: set action
          }}
        >
          <FontAwesomeIcon icon="plus-circle" className={classes.buttonIcon} />
          <p className={classes.buttonText}>{buttonText}</p>
        </Button>
      </div>
    </Badge>
  );
};

export default LowBalanceBadge;
