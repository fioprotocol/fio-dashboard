import React from 'react';

import classnames from 'classnames';

import { CheckIconComponent } from '../../../CheckIconComponent';
import { AddToCartButton } from '../AddToCartButton';
import { FCHItem } from '../FCHItem';
import { PirceItem } from '../PriceItem';

import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';
import { CartItem } from '../../../../types';

import classes from './MobileSelectionItem.module.scss';

type Props = {
  onClick: (selectedItem: CartItem) => void;
  hasWhiteBackground?: boolean;
  actionComponent: React.ReactNode;
  hasMaxWidth?: boolean;
} & SelectedItemProps;

export const MobileSelectionItem: React.FC<Props> = props => {
  const {
    actionComponent,
    address,
    costFio,
    costNativeFio,
    costUsdc,
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
        hasWhiteBackground && classes.hasWhiteBackground,
        hasMaxWidth && classes.hasMaxWidth,
      )}
    >
      <CheckIconComponent fontSize="18px" isGreen />
      <div className={classes.centralContainer}>
        <FCHItem address={address} domain={domain} hasSmallFont />
        <div className={classes.priceContainer}>
          <PirceItem
            costNativeFio={costNativeFio}
            costUsdc={costUsdc}
            costFio={costFio}
            domainType={domainType}
            isFree={isFree}
          />
        </div>
        <div
          className={classnames(
            classes.badgeContainer,
            hasMaxWidth && classes.hasMaxWidth,
          )}
        >
          {actionComponent}
        </div>
      </div>
      <AddToCartButton {...props} />
    </div>
  );
};
