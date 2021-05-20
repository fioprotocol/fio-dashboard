import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { ROUTES } from '../../constants/routes';
import colors from '../../assets/styles/colorsToJs.module.scss';
import CartSmallContainer from '../CartSmallContainer/CartSmallContainer';
import classes from './Cart.module.scss';

const CartAmount = props => {
  const { cart } = props;
  const totalCost = () => {
    if (cart.length === 1 && cart.some(item => !item.costFio && !item.costUsdc))
      return 'FREE';

    const cost =
      !isEmpty(cart) &&
      cart
        .filter(item => item.costFio && item.costUsdc)
        .reduce((acc, item) => {
          if (!acc['costFio']) acc['costFio'] = 0;
          if (!acc['costUsdc']) acc['costUsdc'] = 0;
          return {
            costFio: acc['costFio'] + item.costFio,
            costUsdc: acc['costUsdc'] + item.costUsdc,
          };
        }, {});

    return (
      <span>
        {(Number.isFinite(cost.costFio) && cost.costFio.toFixed(2)) || 0} FIO /{' '}
        {(Number.isFinite(cost.costUsdc) && cost.costUsdc.toFixed(2)) || 0} USDC
      </span>
    );
  };
  return (
    <CartSmallContainer bgColor={colors.hint}>
      <h3 className={classes.amountTitle}>Amount Due</h3>
      <h5 className={classes.amountSubtitle}>Total Due</h5>
      <div className={classes.total}>
        <hr className={classes.divider} />
        <p className={classes.cost}>
          Cost: {totalCost()} <span className={classes.light}>(annually)</span>
        </p>
        <hr className={classes.divider} />
      </div>
      <Link to={ROUTES.CHECKOUT}>
        <Button className={classes.checkout}>
          <FontAwesomeIcon icon="wallet" className={classes.icon} />
          <p>Pay with FIO</p>
        </Button>
      </Link>
    </CartSmallContainer>
  );
};

export default CartAmount;
