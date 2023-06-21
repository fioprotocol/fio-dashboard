import React from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import Badge, {
  BADGE_TYPES,
} from '../../../../../../../components/Badge/Badge';
import CommonBadge from '../../../../../../../components/Badges/CommonBadge/CommonBadge';

import classes from './PublicAddressComponent.module.scss';

type Props = {
  chainCodeName: string;
  iconSrc: string;
  publicAddress: string;
  tokenCodeName: string;
  tokenCode: string;
};

export const PublicAddressComponent: React.FC<Props> = props => {
  const { chainCodeName, iconSrc, tokenCodeName, tokenCode } = props;

  return (
    <Badge show className={classes.container} type={BADGE_TYPES.WHITE}>
      <div className={classes.cotnentContainer}>
        <div className={classes.image}>
          <img src={iconSrc} alt={tokenCodeName} />
        </div>
        <p className={classes.tokenCodeName}>
          {tokenCodeName} <span>({tokenCode})</span>
        </p>
        {chainCodeName !== tokenCodeName && (
          <div className={classes.chainCodeBagde}>
            <CommonBadge classNames={classes.chainCode}>
              {chainCodeName}
            </CommonBadge>
          </div>
        )}
      </div>
      <ArrowForwardIosIcon className={classes.arrow} />
    </Badge>
  );
};
