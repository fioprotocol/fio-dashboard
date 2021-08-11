import React from 'react';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import { PublicAddressSubItemType } from '../types';
import { FioNamePublicAddress } from '../../../types';
import classes from '../ComponentsStyles.module.scss';

const PublicAddressSubItem: React.FC<PublicAddressSubItemType> = props => {
  const { title, tokenItem } = props;
  return (
    <Badge show={true} type={BADGE_TYPES.WHITE}>
      <div className={classes.subItemContainer}>
        <p className={classes.title}>{title}</p>
        <p className={classes.name}>{tokenItem}</p>
      </div>
    </Badge>
  );
};

const PublicAddressItem: React.FC<FioNamePublicAddress> = props => {
  const { chainCode, publicAddress, tokenCode } = props;
  return (
    <div className={classes.linkContainer}>
      <PublicAddressSubItem title="Chain Code" tokenItem={chainCode} />
      <PublicAddressSubItem title="Token Code" tokenItem={tokenCode} />
      <PublicAddressSubItem title="Public Address" tokenItem={publicAddress} />
    </div>
  );
};

export default PublicAddressItem;
