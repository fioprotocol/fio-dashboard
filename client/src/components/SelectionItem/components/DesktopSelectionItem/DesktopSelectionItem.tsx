import React from 'react';
import classnames from 'classnames';

import { CheckIconComponent } from '../../../CheckIconComponent';

import { AddToCartButton } from '../AddToCartButton';
import { FCHItem } from '../FCHItem';
import { PirceItem } from '../PriceItem';
import { DomainTypeBadge } from '../DomainTypeBadge';

import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';
import { CartItem } from '../../../../types';

import classes from './DesktopSelectionItem.module.scss';

type Props = {
  hasShortNamePart?: boolean;
  onClick: (selectedItem: CartItem) => void;
  hasWhiteBackground?: boolean;
} & SelectedItemProps;

export const DesktopSelectionItem: React.FC<Props> = props => {
  const {
    address,
    costFio,
    costNativeFio,
    costUsdc,
    hasShortNamePart,
    domain,
    domainType,
    hasWhiteBackground,
  } = props;

  return (
    <div
      className={classnames(
        classes.container,
        hasShortNamePart && classes.hasShortNamePart,
        hasWhiteBackground && classes.hasWhiteBackground,
      )}
    >
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
          domainType={domainType}
        />
      </div>
      <AddToCartButton {...props} />
    </div>
  );
};
