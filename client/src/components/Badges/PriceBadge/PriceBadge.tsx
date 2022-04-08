import React from 'react';
import classnames from 'classnames';

import Amount from '../../common/Amount';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import classes from './PriceBadge.module.scss';

type Props = {
  costNativeFio?: number | null;
  costFree?: string;
  costFio?: string;
  costUsdc?: string;
  type: string;
  title: string;
};

const PriceBadge: React.FC<Props> = props => {
  const { costNativeFio, costFree, title, type, costFio, costUsdc } = props;

  const isBlack = type === BADGE_TYPES.BLACK;
  return (
    <Badge type={type} show>
      <div className={classnames(classes.item, isBlack && classes.black)}>
        {title && (
          <span className={classnames(classes.name, 'boldText')}>{title}</span>
        )}
        <p className={classes.totalPrice}>
          <span className="boldText">
            {costNativeFio && costFio && costUsdc ? (
              <>
                <Amount value={costFio} /> FIO / <Amount value={costUsdc} />{' '}
                USDC
              </>
            ) : (
              costFree
            )}
          </span>
        </p>
      </div>
    </Badge>
  );
};

export default PriceBadge;
