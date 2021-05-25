import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../Badge/Badge';
import classes from './Cart.module.scss';

const CartItem = props => {
  const { item, onDelete } = props;
  return (
    <Badge show type={BADGE_TYPES.WHITE}>
      <div className={classes.itemContainer}>
        {item.address ? (
          <span className={classes.address}>
            <span className="boldText">{item.address}@</span>
            <span>{item.domain}</span>
          </span>
        ) : (
          <span className="boldText">{item.domain && item.domain}</span>
        )}
        <p
          className={classnames(classes.price, onDelete && classes.deletePrice)}
        >
          <span className="boldText">
            {!item.costFio
              ? 'FREE'
              : `${item.costFio.toFixed(2)} FIO (${item.costUsdc.toFixed(
                  2,
                )} USDC)`}
          </span>
        </p>
        {onDelete && (
          <FontAwesomeIcon
            icon="times-circle"
            className={classes.icon}
            onClick={() => onDelete(item.id)}
          />
        )}
      </div>
    </Badge>
  );
};

export default CartItem;
