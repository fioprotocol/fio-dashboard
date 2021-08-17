import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import { FioNamePublicAddress } from '../../../types';
import { useCheckIfDesktop } from '../../../screenType';

import classes from './PublicAddress.module.scss';

const PublicAddress: React.FC<FioNamePublicAddress> = props => {
  const { chainCode, publicAddress, tokenCode } = props;
  const [isOpen, toggleOpen] = useState(false);
  const onClick = () => toggleOpen(!isOpen);

  const isDesktop = useCheckIfDesktop();

  const renderDesktopStyle = () => (
    <div className={classes.publicAddressContainer}>
      <p className="boldText">{tokenCode}</p>
      <p className={classes.chainCode}>
        Chain Code: <span className="boldText">{chainCode}</span>
      </p>
      <p className={classes.publicAddressItem}>{publicAddress}</p>
    </div>
  );

  const renderMobileStyle = () => (
    <div
      className={classnames(
        classes.publicAddressMobileContainer,
        isOpen && classes.containerOpen,
      )}
      onClick={onClick}
    >
      <div className={classes.visiblePart}>
        <p className="boldText">{tokenCode}</p>
        <p className={classes.chainCode}>
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
  );

  return (
    <Badge show={true} type={BADGE_TYPES.WHITE}>
      {isDesktop ? renderDesktopStyle() : renderMobileStyle()}
    </Badge>
  );
};

export default PublicAddress;
