import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import AddShoppingCart from '@mui/icons-material/AddShoppingCart';

import checkedCartIconSrc from '../../../../assets/images/shopping-cart-checkout.svg';

import classes from './AddToCartButton.module.scss';

type Props = {
  isSelected: boolean;
  onClick: () => void;
};

export const AddToCartButton: React.FC<Props> = props => {
  const { isSelected, onClick } = props;
  return (
    <Button
      onClick={onClick}
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
