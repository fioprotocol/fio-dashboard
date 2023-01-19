import React from 'react';

import CommonBadge from '../../../Badges/CommonBadge/CommonBadge';
import { AddToCartButton } from '../AddToCartButton';
import { FCHItem } from '../FCHItem';
import { PirceItem } from '../PriceItem';

import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';

import classes from './SquareShapeSelectionItem.module.scss';

type Props = {
  onClick: () => void;
} & SelectedItemProps;

export const SquareShapeSelectionItem: React.FC<Props> = props => {
  const {
    address,
    costFio,
    costNativeFio,
    costUsdc,
    domain,
    isSelected,
    status,
    onClick,
  } = props;

  return (
    <div className={classes.container}>
      <FCHItem address={address} domain={domain} />
      <div className={classes.badge}>
        <CommonBadge>{status}</CommonBadge>
      </div>
      <div className={classes.priceContainer}>
        <PirceItem
          costNativeFio={costNativeFio}
          costUsdc={costUsdc}
          costFio={costFio}
          hasSmallFontSize
        />
      </div>

      <div className={classes.buttonContainer}>
        <AddToCartButton onClick={onClick} isSelected={isSelected} />
      </div>
    </div>
  );
};
