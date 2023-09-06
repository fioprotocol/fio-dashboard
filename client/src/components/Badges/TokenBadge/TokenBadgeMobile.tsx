import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    badgeType,
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

  const textHasWhiteColor = badgeType === BADGE_TYPES.BLACK;

  return (
    <div className={classes.mobileContainer}>
      <Badge show={true} type={badgeType || BADGE_TYPES.WHITE}>
        <div
          className={classnames(
            classes.addressMobileContainer,
            (isOpen || actionButton) && classes.containerOpen,
            textHasWhiteColor && classes.textHasWhiteColor,
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
              <ExpandMoreIcon
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
