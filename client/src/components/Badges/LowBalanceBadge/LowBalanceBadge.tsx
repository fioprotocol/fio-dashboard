import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import classes from './LowBalanceBadge.module.scss';

const DEFAULT_TEXT = {
  buttonText: 'Where to Buy',
  messageText:
    'Unfortunately there is not enough FIO available to complete your purchase. Please purchase or deposit additional FIO',
};

type Props = {
  hasLowBalance: boolean;
  onActionClick?: () => void;
  buttonText?: string;
  messageText?: string;
};

const LowBalanceBadge: React.FC<Props> = props => {
  const {
    buttonText = DEFAULT_TEXT.buttonText,
    messageText = DEFAULT_TEXT.messageText,
    onActionClick,
    hasLowBalance,
  } = props;

  const renderButton = () => {
    if (onActionClick == null) return null;
    return (
      <Button className={classes.button} onClick={onActionClick}>
        <FontAwesomeIcon icon="plus-circle" className={classes.buttonIcon} />
        <p className={classes.buttonText}>{buttonText}</p>
      </Button>
    );
  };

  return (
    <Badge type={BADGE_TYPES.ERROR} show={hasLowBalance}>
      <div className={classes.errorContainer}>
        <div className={classes.textContainer}>
          <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
          <p className={classes.text}>
            <span className="boldText">Low Balance!</span> - {messageText}
          </p>
        </div>
        {renderButton()}
      </div>
    </Badge>
  );
};

export default LowBalanceBadge;
