import React from 'react';

import { CheckIconComponent } from '../../../CheckIconComponent';
import { AddToCartButton } from '../AddToCartButton';
import { FCHItem } from '../FCHItem';
import { PirceItem } from '../PriceItem';
import { DomainTypeBadge } from '../DomainTypeBadge';

import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';

import classes from './MobileSelectionItem.module.scss';

type Props = {
  onClick: () => void;
} & SelectedItemProps;

export const MobileSelectionItem: React.FC<Props> = props => {
  const {
    address,
    costFio,
    costNativeFio,
    costUsdc,
    domain,
    domainType,
    isSelected,
    onClick,
  } = props;

  return (
    <div className={classes.container}>
      <CheckIconComponent fontSize="18px" isGreen />
      <div className={classes.centralContainer}>
        <FCHItem address={address} domain={domain} hasSmallFont />
        <div className={classes.priceContainer}>
          <PirceItem
            costNativeFio={costNativeFio}
            costUsdc={costUsdc}
            costFio={costFio}
          />
        </div>
        <div className={classes.badgeContainer}>
          <DomainTypeBadge domainType={domainType} />
        </div>
      </div>
      <AddToCartButton onClick={onClick} isSelected={isSelected} />
    </div>
  );
};
