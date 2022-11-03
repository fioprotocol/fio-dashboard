import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { TokenBadgeProps } from './types';

import classes from './TokenBadge.module.scss';

const TokenBadgeDesktop: React.FC<TokenBadgeProps> = props => {
  const {
    actionButton,
    chainCode,
    input,
    tokenCode,
    publicAddress,
    showInput,
    isBold,
    badgeType,
  } = props;

  const textHasWhiteColor = badgeType === BADGE_TYPES.BLACK;

  return (
    <Badge show={true} type={badgeType || BADGE_TYPES.WHITE}>
      <div className={classes.container}>
        <div
          className={classnames(
            classes.addressContainer,
            textHasWhiteColor && classes.textHasWhiteColor,
          )}
        >
          <p className="boldText">{tokenCode}</p>
          <p className={classes.subtitle}>
            Chain Code: <span className="boldText">{chainCode}</span>
          </p>
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
        {actionButton}
      </div>
    </Badge>
  );
};

export default TokenBadgeDesktop;
