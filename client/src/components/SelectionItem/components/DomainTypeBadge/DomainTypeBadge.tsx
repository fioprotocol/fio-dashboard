import React from 'react';

import CommonBadge from '../../../Badges/CommonBadge/CommonBadge';

import { DOMAIN_TYPE_PARAMS } from '../../../../constants/fio';

import { DomainItemType } from '../../../../types';

import classes from './DomainTypeBadge.module.scss';

type Props = {
  domainType: DomainItemType;
};

export const DomainTypeBadge: React.FC<Props> = props => {
  const { domainType } = props;
  return (
    <div className={classes.badgeContainer}>
      <CommonBadge
        isBlue={DOMAIN_TYPE_PARAMS[domainType].isBlue}
        isOrange={DOMAIN_TYPE_PARAMS[domainType].isOrange}
        isRed={DOMAIN_TYPE_PARAMS[domainType].isRed}
        isRose={DOMAIN_TYPE_PARAMS[domainType].isRose}
      >
        <div className={classes.text}>
          {DOMAIN_TYPE_PARAMS[domainType].title}
        </div>
      </CommonBadge>
    </div>
  );
};
