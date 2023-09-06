import React from 'react';

import Loader from '../../../../components/Loader/Loader';

import {
  PURCHASE_RESULTS_STATUS,
  PURCHASE_RESULTS_TITLES,
} from '../../../../constants/purchase';

import classes from './Title.module.scss';

type Props = {
  orderStatus: number;
};

type DefaultTitleProps = {
  title: string;
};

const DefaultTitle: React.FC<DefaultTitleProps> = props => {
  return (
    <div className={classes.container}>
      <div className={classes.iconContainer}>
        <Loader className={classes.icon} />
      </div>
      {props.title}
    </div>
  );
};

export const Title: React.FC<Props> = props => {
  const { orderStatus } = props;

  if (
    !orderStatus ||
    !PURCHASE_RESULTS_TITLES[orderStatus] ||
    orderStatus === PURCHASE_RESULTS_STATUS.PENDING ||
    orderStatus === PURCHASE_RESULTS_STATUS.PAYMENT_PENDING
  )
    return (
      <DefaultTitle
        title={PURCHASE_RESULTS_TITLES[PURCHASE_RESULTS_STATUS.PENDING].title}
      />
    );
  return <>{PURCHASE_RESULTS_TITLES[orderStatus]?.title}</>;
};
