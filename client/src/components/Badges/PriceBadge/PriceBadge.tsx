import React from 'react';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import classnames from 'classnames';

import classes from './PriceBadge.module.scss';
type Props = {
  costFio: number;
  costFree?: string;
  costUsdc: number;
  type: string;
  title: string;
};

const PriceBadge: React.FC<Props> = props => {
  const { costFio, costFree, costUsdc, title, type } = props;
  const isBlack = type === BADGE_TYPES.BLACK;
  return (
    <Badge type={type} show>
      <div className={classnames(classes.item, isBlack && classes.black)}>
        <span className={classnames(classes.name, 'boldText')}>{title}</span>
        <p className={classes.totalPrice}>
          <span className="boldText">
            {costFio && costUsdc
              ? `${costFio.toFixed(2)} FIO / ${costUsdc.toFixed(2)} USDC`
              : costFree}
          </span>
        </p>
      </div>
    </Badge>
  );
};

export default PriceBadge;
