import React, { useState } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import { PublicAddressDoublet } from '../../../types';
import classes from './TokenBadge.module.scss';

const TokenBadgeMobile: React.FC<PublicAddressDoublet> = props => {
  const { chainCode, publicAddress, tokenCode } = props;
  const [isOpen, toggleOpen] = useState(false);
  const onClick = () => toggleOpen(!isOpen);
  return (
    <Badge show={true} type={BADGE_TYPES.WHITE}>
      <div
        className={classnames(
          classes.addressMobileContainer,
          isOpen && classes.containerOpen,
        )}
        onClick={onClick}
      >
        <div className={classes.visiblePart}>
          <p className="boldText">{tokenCode}</p>
          <p className={classes.subtitle}>
            Chain Code: <span className="boldText">{chainCode}</span>
          </p>
          <FontAwesomeIcon
            icon="chevron-down"
            className={classnames(classes.icon, isOpen && classes.open)}
          />
        </div>
        <div className={classes.pubAddress}>
          <p className={classes.title}>Public Address:</p>
          <p className={classes.publicAddressItem}>{publicAddress}</p>
        </div>
      </div>
    </Badge>
  );
};

export default TokenBadgeMobile;
