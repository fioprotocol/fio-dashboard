import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import AddShoppingCart from '@mui/icons-material/AddShoppingCart';

import checkedCartIconSrc from '../../../../assets/images/shopping-cart-checkout.svg';

import { CartItem } from '../../../../types';
import { SelectedItemProps } from '../../../../pages/FioAddressSelectionPage/types';

import classes from './AddToCartButton.module.scss';

type Props = {
  onClick: (selectedItem: CartItem) => void;
} & SelectedItemProps;

export const AddToCartButton: React.FC<Props> = props => {
  const {
    id,
    address,
    allowFree,
    domain,
    costFio,
    costNativeFio,
    costUsdc,
    domainType,
    period,
    type,
    isSelected,
    onClick,
  } = props;

  const selectedItem = {
    id,
    allowFree,
    address,
    domain,
    costFio,
    costNativeFio,
    costUsdc,
    domainType,
    period,
    type,
  };

  return (
    <Button
      onClick={() => onClick(selectedItem)}
      className={classnames(classes.button, isSelected && classes.isSelected)}
    >
      {isSelected ? (
        <img title="cart" src={checkedCartIconSrc} alt="Cart" />
      ) : (
        <AddShoppingCart />
      )}
    </Button>
  );
};
