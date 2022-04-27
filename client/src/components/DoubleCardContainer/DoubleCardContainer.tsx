import React from 'react';

import LayoutContainer from '../LayoutContainer/LayoutContainer';

import classes from './DoubleCardContainer.module.scss';

type Props = {
  title: string;
  bigCart?: React.ReactNode;
  smallCart?: React.ReactNode;
};

const DoubleCardContainer: React.FC<Props> = props => {
  const { title, bigCart, smallCart } = props;
  return (
    <LayoutContainer title={title}>
      <div className={classes.container}>
        <div className={classes.cardContainer}>{bigCart}</div>
        <hr className={classes.vertical} />
        {smallCart}
      </div>
    </LayoutContainer>
  );
};

export default DoubleCardContainer;
