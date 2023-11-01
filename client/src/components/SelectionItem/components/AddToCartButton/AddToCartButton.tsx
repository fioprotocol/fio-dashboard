import React, { useCallback, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import AddShoppingCart from '@mui/icons-material/AddShoppingCart';

import checkedCartIconSrc from '../../../../assets/images/shopping-cart-checkout.svg';

import { CartItem } from '../../../../types';
import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';

import classes from './AddToCartButton.module.scss';

type Props = {
  disabled?: boolean;
  onClick: (selectedItem: CartItem) => void;
} & SelectedItemProps;

export const AddToCartButton: React.FC<Props> = props => {
  const {
    id,
    address,
    domain,
    disabled,
    costFio,
    costNativeFio,
    costUsdc,
    nativeFioAddressPrice,
    domainType,
    isFree,
    // hasCustomDomain,
    period,
    type,
    isSelected,
    onClick,
  } = props;

  const selectedItem = useMemo(
    () => ({
      id,
      address,
      domain,
      costFio,
      costNativeFio,
      costUsdc,
      domainType,
      isFree,
      // hasCustomDomain,
      nativeFioAddressPrice,
      period,
      type,
    }),
    [
      address,
      costFio,
      costNativeFio,
      costUsdc,
      domain,
      domainType,
      // hasCustomDomain,
      id,
      isFree,
      nativeFioAddressPrice,
      period,
      type,
    ],
  );

  const onActionClick = useCallback(() => {
    if (!isSelected) {
      onClick(selectedItem);
    }
  }, [isSelected, onClick, selectedItem]);

  return (
    <Button
      onClick={onActionClick}
      className={classnames(classes.button, isSelected && classes.isSelected)}
      disabled={disabled}
    >
      <div>
        {isSelected ? (
          <img
            title="cart"
            src={checkedCartIconSrc}
            alt="Cart"
            className={classes.icon}
          />
        ) : (
          <AddShoppingCart />
        )}
      </div>
    </Button>
  );
};
