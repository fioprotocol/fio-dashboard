import React from 'react';

import classnames from 'classnames';

import { AddToCartButton } from '../AddToCartButton';
import { FCHItem } from '../FCHItem';
import { PirceItem } from '../PriceItem';

import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';
import { CartItem } from '../../../../types';

import classes from './SquareShapeSelectionItem.module.scss';

type Props = {
  actionComponent: React.ReactNode;
  disabled?: boolean;
  onClick: (selectedItem: CartItem) => void;
} & SelectedItemProps;

export const SquareShapeSelectionItem: React.FC<Props> = props => {
  const {
    actionComponent,
    address,
    costFio,
    costNativeFio,
    costUsdc,
    disabled,
    domain,
    domainType,
    isFree,
  } = props;

  return (
    <div
      className={classnames(classes.container, disabled && classes.disabled)}
    >
      <FCHItem address={address} domain={domain} hasCenteredText />
      <div className={classes.badge}>{actionComponent}</div>
      <div className={classes.priceContainer}>
        <PirceItem
          costNativeFio={costNativeFio}
          costUsdc={costUsdc}
          costFio={costFio}
          domainType={domainType}
          isFree={isFree}
          hasSmallFontSize
        />
      </div>

      <div className={classes.buttonContainer}>
        <AddToCartButton {...props} />
      </div>
    </div>
  );
};
