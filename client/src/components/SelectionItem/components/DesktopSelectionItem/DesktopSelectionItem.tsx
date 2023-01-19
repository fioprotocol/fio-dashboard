import React from 'react';

import { CheckIconComponent } from '../../../CheckIconComponent';

import { AddToCartButton } from '../AddToCartButton';
import { FCHItem } from '../FCHItem';
import { PirceItem } from '../PriceItem';
import { DomainTypeBadge } from '../DomainTypeBadge';

import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';

import classes from './DesktopSelectionItem.module.scss';

type Props = {
  onClick: () => void;
} & SelectedItemProps;

export const DesktopSelectionItem: React.FC<Props> = props => {
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
      <div className={classes.fchContainer}>
        <FCHItem address={address} domain={domain} />
      </div>
      <div className={classes.badgeContainer}>
        <DomainTypeBadge domainType={domainType} />
      </div>
      <div className={classes.priceContainer}>
        <PirceItem
          costNativeFio={costNativeFio}
          costUsdc={costUsdc}
          costFio={costFio}
        />
      </div>
      <AddToCartButton onClick={onClick} isSelected={isSelected} />
    </div>
  );
};
