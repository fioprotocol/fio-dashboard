import React from 'react';

import { AddToCartButton } from '../AddToCartButton';
import { FCHItem } from '../FCHItem';
import { PirceItem } from '../PriceItem';
import { DomainTypeBadge } from '../DomainTypeBadge';

import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';
import { CartItem } from '../../../../types';

import classes from './SquareShapeSelectionItem.module.scss';

type Props = {
  onClick: (selectedItem: CartItem) => void;
} & SelectedItemProps;

export const SquareShapeSelectionItem: React.FC<Props> = props => {
  const {
    address,
    costFio,
    costNativeFio,
    costUsdc,
    domain,
    domainType,
  } = props;

  return (
    <div className={classes.container}>
      <FCHItem address={address} domain={domain} hasCenteredText />
      <div className={classes.badge}>
        <DomainTypeBadge domainType={domainType} />
      </div>
      <div className={classes.priceContainer}>
        <PirceItem
          costNativeFio={costNativeFio}
          costUsdc={costUsdc}
          costFio={costFio}
          domainType={domainType}
          hasSmallFontSize
        />
      </div>

      <div className={classes.buttonContainer}>
        <AddToCartButton {...props} />
      </div>
    </div>
  );
};
