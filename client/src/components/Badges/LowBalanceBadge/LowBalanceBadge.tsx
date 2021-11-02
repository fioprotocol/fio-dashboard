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
  buttonText?: string;
  messageText?: string;
};

const LowBalanceBadge: React.FC<Props> = props => {
  const {
    buttonText = DEFAULT_TEXT.buttonText,
    messageText = DEFAULT_TEXT.messageText,
    hasLowBalance,
  } = props;
  if (!hasLowBalance) return null;

  // todo: removed action button because there is no action on it
  //@ts-ignore
  // eslint-disable-next-line no-unused-vars
  const renderButton = () => (
    <Button
      className={classes.button}
      onClick={() => {
        //todo: set action
      }}
    >
      <FontAwesomeIcon icon="plus-circle" className={classes.buttonIcon} />
      <p className={classes.buttonText}>{buttonText}</p>
    </Button>
  );

  return (
    <Badge type={BADGE_TYPES.ERROR} show={true}>
      <div className={classes.errorContainer}>
        <div className={classes.textContainer}>
          <FontAwesomeIcon icon="exclamation-circle" className={classes.icon} />
          <p className={classes.text}>
            <span className="boldText">Low Balance!</span> - {messageText}
          </p>
        </div>
        {/* {renderButton()} */}
      </div>
    </Badge>
  );
};

export default LowBalanceBadge;
