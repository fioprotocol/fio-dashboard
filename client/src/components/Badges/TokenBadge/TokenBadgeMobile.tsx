import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import { TokenBadgeProps } from './types';

import classes from './TokenBadge.module.scss';

const TokenBadgeMobile: React.FC<TokenBadgeProps> = props => {
  const {
    chainCode,
    publicAddress,
    tokenCode,
    actionButton,
    input,
    showInput,
    isBold,
  } = props;

  const [isOpen, toggleOpen] = useState(false);

  useEffect(() => {
    if (actionButton) {
      toggleOpen(false);
    } else {
      toggleOpen(!!showInput);
    }
  }, [showInput, actionButton]);

  const onClick = () => {
    !actionButton && toggleOpen(!isOpen);
  };

  return (
    <div className={classes.mobileContainer}>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div
          className={classnames(
            classes.addressMobileContainer,
            (isOpen || actionButton) && classes.containerOpen,
          )}
          onClick={onClick}
        >
          <div className={classes.visiblePart}>
            <div className={classes.textVisiblePart}>
              <p className="boldText">{tokenCode}</p>
              <p className={classes.subtitle}>
                Chain Code: <span className="boldText">{chainCode}</span>
              </p>
            </div>

            {actionButton ? (
              actionButton
            ) : (
              <FontAwesomeIcon
                icon="chevron-down"
                className={classnames(classes.icon, isOpen && classes.open)}
              />
            )}
          </div>
          <div className={classes.pubAddress}>
            <p className={classes.title}>Public Address:</p>
            {showInput ? (
              input
            ) : (
              <p
                className={classnames(
                  classes.publicAddressItem,
                  isBold && classes.bold,
                )}
              >
                {publicAddress}
              </p>
            )}
          </div>
        </div>
      </Badge>
    </div>
  );
};

export default TokenBadgeMobile;
