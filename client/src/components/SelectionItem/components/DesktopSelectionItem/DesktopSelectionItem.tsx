import React from 'react';
import classnames from 'classnames';

import { CheckIconComponent } from '../../../CheckIconComponent';

import { AddToCartButton } from '../AddToCartButton';
import { FCHItem } from '../FCHItem';
import { PirceItem } from '../PriceItem';

import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';
import { CartItem } from '../../../../types';

import classes from './DesktopSelectionItem.module.scss';

type Props = {
  actionComponent: React.ReactNode;
  hasShortNamePart?: boolean;
  onClick: (selectedItem: CartItem) => void;
  hasWhiteBackground?: boolean;
  hasMaxWidth?: boolean;
} & SelectedItemProps;

export const DesktopSelectionItem: React.FC<Props> = props => {
  const {
    actionComponent,
    address,
    costFio,
    costNativeFio,
    costUsdc,
    hasShortNamePart,
    domain,
    domainType,
    hasWhiteBackground,
    hasMaxWidth,
    isFree,
  } = props;

  return (
    <div
      className={classnames(
        classes.container,
        hasShortNamePart && classes.hasShortNamePart,
        hasWhiteBackground && classes.hasWhiteBackground,
        hasMaxWidth && classes.hasMaxWidth,
      )}
    >
      <CheckIconComponent fontSize="18px" isGreen />
      <div className={classes.fchContainer}>
        <FCHItem address={address} domain={domain} />
      </div>
      <div
        className={classnames(
          classes.badgeContainer,
          hasMaxWidth && classes.hasMaxWidth,
        )}
      >
        {actionComponent}
      </div>
      <div className={classes.priceContainer}>
        <PirceItem
          costNativeFio={costNativeFio}
          costUsdc={costUsdc}
          costFio={costFio}
          domainType={domainType}
          isFree={isFree}
          hasMarginRight
        />
      </div>
      <AddToCartButton {...props} />
    </div>
  );
};
