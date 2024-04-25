import React from 'react';

import classnames from 'classnames';

import CommonBadge from '../../../../../../../components/Badges/CommonBadge/CommonBadge';

import classes from './ChainComponent.module.scss';

type Props = {
  chainCodeName: string;
  hasBigImage?: boolean;
  iconSrc: string;
  tokenCodeName: string;
  tokenCode: string;
};

export const ChainComponent: React.FC<Props> = props => {
  const {
    chainCodeName,
    hasBigImage,
    iconSrc,
    tokenCode,
    tokenCodeName,
  } = props;
  return (
    <div className={classes.cotnentContainer}>
      <div
        className={classnames(
          classes.image,
          hasBigImage && classes.hasBigImage,
        )}
      >
        <img src={iconSrc} alt={tokenCodeName} />
      </div>
      <p className={classes.tokenCodeName}>
        {tokenCodeName || `${chainCodeName} Tokens`}&nbsp;
        {tokenCode && <span>({tokenCode})</span>}
      </p>
      {chainCodeName !== tokenCodeName && (
        <div className={classes.chainCodeBagde}>
          <CommonBadge classNames={classes.chainCode}>
            {chainCodeName}
          </CommonBadge>
        </div>
      )}
    </div>
  );
};
